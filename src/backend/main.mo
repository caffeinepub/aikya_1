import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Type definitions
  type UserRole = {
    #teacher;
    #learner;
  };

  module UserRole {
    public func compare(type1 : UserRole, type2 : UserRole) : Order.Order {
      switch (type1, type2) {
        case (#learner, #teacher) { #less };
        case (#teacher, #learner) { #greater };
        case (_, _) { #equal };
      };
    };
  };

  public type AikyaUser = {
    username : Text;
    subject : Text;
    role : UserRole;
    profileInfo : Text;
  };

  public type Group = {
    id : Nat;
    teacher : Principal;
    learners : [Principal];
    subject : Text;
    isActive : Bool;
  };

  public type Session = {
    id : Nat;
    teacher : Principal;
    subject : Text;
    topic : Text;
    scheduledTime : Text;
    googleMeetLink : Text;
    groupId : Nat;
  };

  public type Review = {
    reviewer : Principal;
    teacher : Principal;
    rating : Nat;
    comment : Text;
  };

  public type ChatMessage = {
    sender : Principal;
    senderUsername : Text;
    message : Text;
    timestamp : Time.Time;
  };

  public type Note = {
    title : Text;
    content : Text;
  };

  // State variables
  let users = Map.empty<Principal, AikyaUser>();
  let groups = Map.empty<Nat, Group>();
  let sessions = Map.empty<Nat, Session>();
  let reviews = List.empty<Review>();
  let chatMessages = Map.empty<Nat, List.List<ChatMessage>>();
  let notifications = Map.empty<Principal, List.List<Text>>();
  let notes = Map.empty<Principal, List.List<Note>>();

  var nextGroupId = 1;
  var nextSessionId = 1;
  var nextReviewId = 1;
  var nextMessageId = 1;

  // Component: Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper function to check if user is registered
  func isRegisteredUser(caller : Principal) : Bool {
    users.containsKey(caller);
  };

  // Helper function to check if caller is member of a group
  func isGroupMember(caller : Principal, groupId : Nat) : Bool {
    switch (groups.get(groupId)) {
      case (null) { false };
      case (?group) {
        if (group.teacher == caller) {
          return true;
        };
        for (learner in group.learners.vals()) {
          if (learner == caller) {
            return true;
          };
        };
        false;
      };
    };
  };

  // User management
  public shared ({ caller }) func registerUser(username : Text, subject : Text, role : UserRole, profileInfo : Text) : async () {
    // Anyone can register (including guests/anonymous)
    if (users.containsKey(caller)) {
      Runtime.trap("This user is already registered.");
    };

    let user : AikyaUser = {
      username;
      subject;
      role;
      profileInfo;
    };

    users.add(caller, user);
  };

  public query ({ caller }) func getMyUser() : async ?AikyaUser {
    // User can view their own profile
    users.get(caller);
  };

  public query ({ caller }) func getUser(user : Principal) : async ?AikyaUser {
    // Only registered users can view other users' profiles
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only registered users can view profiles");
    };
    users.get(user);
  };

  // Required by frontend: UserProfile interface
  public type UserProfile = AikyaUser;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    users.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only registered users can view profiles");
    };
    users.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    // Update existing user profile
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only registered users can save profiles");
    };
    users.add(caller, profile);
  };

  // Group management
  public query ({ caller }) func getMyGroup() : async ?Group {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only registered users can view groups");
    };

    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) {
        var userGroupId = null;
        let groupIter = groups.values();
        groupIter.find(func(g) { g.subject == user.subject });
      };
    };
  };

  public query ({ caller }) func getGroup(id : Nat) : async Group {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only registered users can view groups");
    };

    // Verify caller is a member of this group
    if (not isGroupMember(caller, id)) {
      Runtime.trap("Unauthorized: You can only view groups you belong to");
    };

    switch (groups.get(id)) {
      case (null) { Runtime.trap("Group not found") };
      case (?group) { group };
    };
  };

  // Session management
  public shared ({ caller }) func createSession(groupId : Nat, topic : Text, scheduledTime : Text, googleMeetLink : Text) : async () {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only registered users can create sessions");
    };

    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) {
        // Only teachers can create sessions
        switch (user.role) {
          case (#learner) { Runtime.trap("Unauthorized: Only teachers can create sessions") };
          case (#teacher) {};
        };
      };
    };

    switch (groups.get(groupId)) {
      case (null) { Runtime.trap("Group not found") };
      case (?group) {
        if (group.teacher != caller) {
          Runtime.trap("Unauthorized: Only the group's teacher can create sessions");
        };

        let groupSessionsCount = sessions.filter(func((_, s)) { s.groupId == groupId }).size();
        if (groupSessionsCount >= 20) {
          Runtime.trap("Cannot have more than 20 sessions per group");
        };

        let session : Session = {
          id = nextSessionId;
          teacher = caller;
          topic;
          subject = group.subject;
          scheduledTime;
          googleMeetLink;
          groupId;
        };

        sessions.add(nextSessionId, session);
        nextSessionId += 1;
      };
    };
  };

  public query ({ caller }) func getMyGroupSessions() : async [Session] {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only registered users can view sessions");
    };

    // Find the caller's group
    let maybeGroup = switch (users.get(caller)) {
      case (null) { null };
      case (?user) { groups.values().find(func(g) { g.subject == user.subject }) };
    };

    switch (maybeGroup) {
      case (null) { [] };
      case (?group) {
        // Verify caller is a member of this group
        if (not isGroupMember(caller, group.id)) {
          Runtime.trap("Unauthorized: You can only view sessions for your group");
        };

        // Filter sessions for this group
        let groupSessions = sessions.filter(
          func(_, session) { session.groupId == group.id }
        ).values().toArray();

        groupSessions;
      };
    };
  };

  // Reviews & Ratings
  public shared ({ caller }) func addReview(teacher : Principal, rating : Nat, comment : Text) : async () {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only registered users can add reviews");
    };

    // Verify caller is a learner
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) {
        switch (user.role) {
          case (#teacher) { Runtime.trap("Unauthorized: Only learners can add reviews") };
          case (#learner) {};
        };
      };
    };

    // Verify the teacher exists and is actually a teacher
    switch (users.get(teacher)) {
      case (null) { Runtime.trap("Teacher not found") };
      case (?teacherUser) {
        switch (teacherUser.role) {
          case (#learner) { Runtime.trap("Cannot review a learner") };
          case (#teacher) {};
        };
      };
    };

    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    let review : Review = {
      reviewer = caller;
      teacher;
      rating;
      comment;
    };

    reviews.add(review);
    nextReviewId += 1;
  };

  public query ({ caller }) func getTeacherReviews(teacher : Principal) : async [Review] {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only registered users can view reviews");
    };

    reviews.filter(func(r) { r.teacher == teacher }).toArray();
  };

  // Chat
  public shared ({ caller }) func sendChatMessage(groupId : Nat, message : Text, senderUsername : Text) : async () {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only registered users can send messages");
    };

    // Verify caller is a member of this group
    if (not isGroupMember(caller, groupId)) {
      Runtime.trap("Unauthorized: You can only send messages to groups you belong to");
    };

    let chatMessage : ChatMessage = {
      sender = caller;
      senderUsername;
      message;
      timestamp = Time.now();
    };

    let groupMessages = switch (chatMessages.get(groupId)) {
      case (null) {
        let newList = List.empty<ChatMessage>();
        newList;
      };
      case (?messagesList) { messagesList };
    };

    groupMessages.add(chatMessage);
    chatMessages.add(groupId, groupMessages);
    nextMessageId += 1;
  };

  public query ({ caller }) func getGroupChatMessages(groupId : Nat) : async [ChatMessage] {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only registered users can view messages");
    };

    // Verify caller is a member of this group
    if (not isGroupMember(caller, groupId)) {
      Runtime.trap("Unauthorized: You can only view messages from groups you belong to");
    };

    switch (chatMessages.get(groupId)) {
      case (null) { [] };
      case (?messagesList) { messagesList.toArray() };
    };
  };

  // Notifications
  public shared ({ caller }) func addNotification(notification : Text) : async () {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only registered users can add notifications");
    };

    let userNotifications = switch (notifications.get(caller)) {
      case (null) {
        let newList = List.empty<Text>();
        newList;
      };
      case (?notifsList) { notifsList };
    };

    // Ensure notifications are not too long
    let currentCount = userNotifications.size();
    if (currentCount >= 30) {
      let slicedNotifs = List.empty<Text>();
      for (i in [0, 1, 2, 3, 4, 5].values()) {
        if (i < currentCount) {
          switch (userNotifications.at(i)) {
            case (item) {
              slicedNotifs.add(item);
            };
          };
        };
      };
      slicedNotifs.add(notification);
      notifications.add(caller, slicedNotifs);
    } else {
      userNotifications.add(notification);
      notifications.add(caller, userNotifications);
    };
  };

  public query ({ caller }) func getNotifications() : async [Text] {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only registered users can view notifications");
    };

    switch (notifications.get(caller)) {
      case (null) { [] };
      case (?notifsList) { notifsList.toArray() };
    };
  };

  public shared ({ caller }) func clearNotifications() : async () {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only registered users can clear notifications");
    };

    notifications.add(caller, List.empty<Text>());
  };

  // Notes
  public shared ({ caller }) func addNote(title : Text, content : Text) : async () {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only registered users can add notes");
    };

    let note : Note = { title; content };

    let userNotes = switch (notes.get(caller)) {
      case (null) {
        let newList = List.empty<Note>();
        newList;
      };
      case (?notesList) { notesList };
    };

    // Ensure notes are not too long
    let currentCount = userNotes.size();
    if (currentCount >= 50) {
      let slicedNotes = List.empty<Note>();
      for (i in [0, 1, 2, 3, 4, 5].values()) {
        if (i < currentCount) {
          switch (userNotes.at(i)) {
            case (item) {
              slicedNotes.add(item);
            };
          };
        };
      };
      slicedNotes.add(note);
      notes.add(caller, slicedNotes);
    } else {
      userNotes.add(note);
      notes.add(caller, userNotes);
    };
  };

  public query ({ caller }) func getNotes() : async [Note] {
    if (not isRegisteredUser(caller)) {
      Runtime.trap("Unauthorized: Only registered users can view notes");
    };

    switch (notes.get(caller)) {
      case (null) { [] };
      case (?notesList) { notesList.toArray() };
    };
  };
};
