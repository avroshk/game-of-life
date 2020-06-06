var context = null;

export const canvasContextReducer = (state, action) => {
  switch (action.type) {
    case 'set':
      context = action.context
      return context;
    default: throw new Error('Unexpected action');
  }
};
