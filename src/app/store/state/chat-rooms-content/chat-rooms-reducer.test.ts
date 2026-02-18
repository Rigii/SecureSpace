import {
  addNewChatRoom,
  addUserChatRooms,
  updateChatRoom,
  deleteChatRoomLocalData,
  addMessagesToChatRoom,
  addMessageToChatRoom,
  clearChatRoomData,
} from './chat-room.actions';
import chatRoomsSlice from './chat-rooms-slice';
import {EChatVariants, IChatMessage, IChatRoom} from './chat-rooms-state.types';

const createMockChatRoom = (id: string, overrides = {}): IChatRoom => ({
  id,
  chatName: `Chat ${id}`,
  invitedUserIds: [],
  messages: [],
  chatType: EChatVariants.private,
  ownerId: '',
  moderatorIds: [],
  messageDurationHours: null,
  password: '',
  chatMediaStorageUrl: '',
  chatIconUrl: null,
  availabilityAreaData: null,
  ...overrides,
});

const createMockMessage = (
  chatRoomId: string,
  messageId: string,
  overrides = {},
): IChatMessage => ({
  id: messageId,
  chatRoomId,
  message: `Message ${messageId}`,
  participantId: 'user-123',
  senderNickame: 'Test User',
  created: new Date().toISOString(),
  isAdmin: false,
  updated: '',
  ...overrides,
});

describe('Chat Rooms Reducer', () => {
  let initialState = {};

  beforeEach(() => {
    initialState = {};
  });

  describe('addUserChatRooms', () => {
    it('should add multiple chat rooms to empty state', () => {
      const chatRooms = {
        'room-1': createMockChatRoom('room-1'),
        'room-2': createMockChatRoom('room-2'),
      };

      const nextState = chatRoomsSlice(
        initialState,
        addUserChatRooms(chatRooms),
      );

      expect(nextState).toEqual({
        'room-1': chatRooms['room-1'],
        'room-2': chatRooms['room-2'],
      });
    });

    it('should merge new chat rooms with existing ones', () => {
      const existingState = {
        'room-1': createMockChatRoom('room-1'),
      };

      const newChatRooms = {
        'room-2': createMockChatRoom('room-2'),
      };

      const nextState = chatRoomsSlice(
        existingState,
        addUserChatRooms(newChatRooms),
      );

      expect(nextState).toEqual({
        'room-1': existingState['room-1'],
        'room-2': newChatRooms['room-2'],
      });
    });

    it('should override existing room with same ID', () => {
      const existingState = {
        'room-1': createMockChatRoom('room-1', {chatName: 'Old Name'}),
      };

      const updatedRoom = {
        'room-1': createMockChatRoom('room-1', {chatName: 'New Name'}),
      };

      const nextState = chatRoomsSlice(
        existingState,
        addUserChatRooms(updatedRoom),
      );

      expect(nextState['room-1'].chatName).toBe('New Name');
    });
  });

  describe('addNewChatRoom', () => {
    it('should add a new chat room when ID does not exist', () => {
      const newRoom = createMockChatRoom('room-1');

      const nextState = chatRoomsSlice(initialState, addNewChatRoom(newRoom));

      expect(nextState).toEqual({
        'room-1': newRoom,
      });
    });

    it('should NOT add chat room if ID already exists', () => {
      const existingRoom = createMockChatRoom('room-1', {
        chatName: 'Existing Room',
      });

      const existingState = {
        'room-1': existingRoom,
      };

      const newRoom = createMockChatRoom('room-1', {
        chatName: 'New Room',
      });

      const nextState = chatRoomsSlice(existingState, addNewChatRoom(newRoom));

      // State should remain unchanged
      expect(nextState).toEqual(existingState);
      expect(nextState['room-1'].chatName).toBe('Existing Room');
    });

    it('should preserve other rooms when adding new one', () => {
      const existingState = {
        'room-1': createMockChatRoom('room-1'),
      };

      const newRoom = createMockChatRoom('room-2');

      const nextState = chatRoomsSlice(existingState, addNewChatRoom(newRoom));

      expect(nextState['room-1']).toBeDefined();
      expect(nextState['room-2']).toBeDefined();
    });
  });

  describe('updateChatRoom', () => {
    it('should update existing chat room', () => {
      const existingState = {
        'room-1': createMockChatRoom('room-1', {
          chatName: 'Original Name',
          invitedUserIds: ['user-1'],
        }),
      };

      const updatedRoom = createMockChatRoom('room-1', {
        chatName: 'Updated Name',
        invitedUserIds: ['user-1', 'user-2'],
      });

      const nextState = chatRoomsSlice(
        existingState,
        updateChatRoom(updatedRoom),
      );

      expect(nextState['room-1'].chatName).toBe('Updated Name');
      expect(nextState['room-1'].invitedUserIds).toHaveLength(2);
    });

    it('should add room if it does not exist (upsert)', () => {
      const newRoom = createMockChatRoom('room-1');

      const nextState = chatRoomsSlice(initialState, updateChatRoom(newRoom));

      expect(nextState['room-1']).toEqual(newRoom);
    });
  });

  describe('deleteChatRoomLocalData', () => {
    it('should delete specific chat room', () => {
      const existingState = {
        'room-1': createMockChatRoom('room-1'),
        'room-2': createMockChatRoom('room-2'),
        'room-3': createMockChatRoom('room-3'),
      };

      const nextState = chatRoomsSlice(
        existingState,
        deleteChatRoomLocalData({chatRoomId: 'room-2'}),
      );

      expect(nextState['room-1']).toBeDefined();
      expect(nextState['room-2']).toBeUndefined();
      expect(nextState['room-3']).toBeDefined();
      expect(Object.keys(nextState)).toHaveLength(2);
    });

    it('should do nothing if chat room does not exist', () => {
      const existingState = {
        'room-1': createMockChatRoom('room-1'),
      };

      const nextState = chatRoomsSlice(
        existingState,
        deleteChatRoomLocalData({chatRoomId: 'nonexistent'}),
      );

      expect(nextState).toEqual(existingState);
    });

    it('should handle empty payload gracefully', () => {
      const existingState = {
        'room-1': createMockChatRoom('room-1'),
      };

      const nextState = chatRoomsSlice(
        existingState,
        // @ts-ignore - testing edge case
        deleteChatRoomLocalData({}),
      );

      // Should not throw, state remains unchanged
      expect(nextState).toEqual(existingState);
    });
  });

  describe('addMessagesToChatRoom', () => {
    it('should add multiple messages to existing chat room', () => {
      const existingState = {
        'room-1': createMockChatRoom('room-1', {
          messages: [],
        }),
      };

      const messages = [
        createMockMessage('room-1', 'msg-1'),
        createMockMessage('room-1', 'msg-2'),
      ];

      const nextState = chatRoomsSlice(
        existingState,
        addMessagesToChatRoom(messages),
      );

      expect(nextState['room-1'].messages).toHaveLength(2);
      expect(nextState['room-1'].messages[0].id).toBe('msg-1');
      expect(nextState['room-1'].messages[1].id).toBe('msg-2');
    });

    it('should replace existing messages, not append', () => {
      const existingState = {
        'room-1': createMockChatRoom('room-1', {
          messages: [createMockMessage('room-1', 'old-msg')],
        }),
      };

      const messages = [
        createMockMessage('room-1', 'new-msg-1'),
        createMockMessage('room-1', 'new-msg-2'),
      ];

      const nextState = chatRoomsSlice(
        existingState,
        addMessagesToChatRoom(messages),
      );

      expect(nextState['room-1'].messages).toHaveLength(2);
      expect(nextState['room-1'].messages[0].id).toBe('new-msg-1');
      expect(
        nextState['room-1'].messages.some(
          (m: {id: string}) => m.id === 'old-msg',
        ),
      ).toBeFalsy();
    });

    it('should do nothing if chat room does not exist', () => {
      const existingState = {
        'room-1': createMockChatRoom('room-1'),
      };

      const messages = [createMockMessage('nonexistent', 'msg-1')];

      const nextState = chatRoomsSlice(
        existingState,
        addMessagesToChatRoom(messages),
      );

      expect(nextState).toEqual(existingState);
    });

    // it('should handle empty messages array', () => {
    //   const existingState = {
    //     'room-1': createMockChatRoom('room-1', {
    //       messages: [createMockMessage('room-1', 'msg-1')],
    //     }),
    //   };

    //   const nextState = chatRoomsSlice(
    //     existingState,
    //     addMessagesToChatRoom([]),
    //   );

    //   expect(nextState['room-1'].messages).toHaveLength(0);
    // });
  });

  describe('addMessageToChatRoom', () => {
    it('should append message to existing chat room', () => {
      const existingState = {
        'room-1': createMockChatRoom('room-1', {
          messages: [createMockMessage('room-1', 'msg-1')],
        }),
      };

      const newMessage = createMockMessage('room-1', 'msg-2');

      const nextState = chatRoomsSlice(
        existingState,
        addMessageToChatRoom(newMessage),
      );

      expect(nextState['room-1'].messages).toHaveLength(2);
      expect(nextState['room-1'].messages[0].id).toBe('msg-1');
      expect(nextState['room-1'].messages[1].id).toBe('msg-2');
    });

    it('should do nothing if chat room does not exist', () => {
      const existingState = {
        'room-1': createMockChatRoom('room-1'),
      };

      const newMessage = createMockMessage('nonexistent', 'msg-1');

      const nextState = chatRoomsSlice(
        existingState,
        addMessageToChatRoom(newMessage),
      );

      expect(nextState).toEqual(existingState);
    });

    it('should preserve other chat rooms when adding message', () => {
      const existingState = {
        'room-1': createMockChatRoom('room-1', {messages: []}),
        'room-2': createMockChatRoom('room-2'),
      };

      const newMessage = createMockMessage('room-1', 'msg-1');

      const nextState = chatRoomsSlice(
        existingState,
        addMessageToChatRoom(newMessage),
      );

      expect(nextState['room-2']).toEqual(existingState['room-2']);
    });
  });
  describe('clearChatRoomData', () => {
    it('should reset state to empty object', () => {
      const populatedState = {
        'room-1': createMockChatRoom('room-1'),
        'room-2': createMockChatRoom('room-2'),
      };

      const nextState = chatRoomsSlice(populatedState, clearChatRoomData());

      expect(nextState).toEqual({});
    });

    it('should handle clearing already empty state', () => {
      const nextState = chatRoomsSlice(initialState, clearChatRoomData());

      expect(nextState).toEqual({});
    });
  });

  describe('Immer.js direct mutation behavior', () => {
    it('should properly handle direct mutation of messages array', () => {
      // This test confirms Immer.js is working correctly
      const state = {
        'room-1': createMockChatRoom('room-1', {messages: []}),
      };

      const newMessage = createMockMessage('room-1', 'msg-1');

      // This uses the direct mutation pattern from your reducer
      const nextState = chatRoomsSlice(state, addMessageToChatRoom(newMessage));

      // Original state should not be mutated
      expect(state['room-1'].messages).toHaveLength(0);

      // New state should have the message
      expect(nextState['room-1'].messages).toHaveLength(1);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete chat room lifecycle', () => {
      // 1. Start empty
      let state = chatRoomsSlice({}, {type: '@@INIT'});
      expect(state).toEqual({});

      // 2. Add new chat room
      const newRoom = createMockChatRoom('room-1');
      state = chatRoomsSlice(state, addNewChatRoom(newRoom));
      expect(state['room-1']).toBeDefined();

      // 3. Update the chat room
      const updatedRoom = createMockChatRoom('room-1', {
        chatName: 'Updated Team Chat',
      });
      state = chatRoomsSlice(state, updateChatRoom(updatedRoom));
      expect(state['room-1'].chatName).toBe('Updated Team Chat');

      // 4. Add messages
      const messages = [
        createMockMessage('room-1', 'msg-1'),
        createMockMessage('room-1', 'msg-2'),
      ];
      state = chatRoomsSlice(state, addMessagesToChatRoom(messages));
      expect(state['room-1'].messages).toHaveLength(2);

      // 5. Add one more message
      const newMessage = createMockMessage('room-1', 'msg-3');
      state = chatRoomsSlice(state, addMessageToChatRoom(newMessage));
      expect(state['room-1'].messages).toHaveLength(3);

      // 6. Delete the chat room
      state = chatRoomsSlice(
        state,
        deleteChatRoomLocalData({chatRoomId: 'room-1'}),
      );
      expect(state['room-1']).toBeUndefined();
    });
  });
});
