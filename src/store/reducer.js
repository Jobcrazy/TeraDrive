const defaultState = {
    bLoading: false,
    currentItem: [],
};

function reducer(state = defaultState, action) {
    switch (action.type) {
        case "setLoading":
            state.bLoading = action.value;
            break;
        case "setMenuItem":
            state.currentItem = action.value;
            break;
        default:
            break;
    }
    return state;
}

export default reducer;
