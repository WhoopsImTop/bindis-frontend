export const state = () => ({
  cartItems: [],
  userLoggedIn: false,
  user: null,
  userToken: null,
  userRole: null,
});

export const getters = {
  cartItems: (state) => state.cartItems,
};

export const mutations = {
  loadCardItems(state, cartItems) {
    state.cartItems = cartItems;
  },
  setCartItems(state, cartItem) {
    console.log("cartItems", cartItem);
    console.log("state.cartItems", state.cartItems);
    //handle quantity if item already exists
    let itemExists = state.cartItems.find((item) => item.id === cartItem.id);
    if (itemExists) {
      itemExists.quantity++;
    } else {
      state.cartItems.push(cartItem);
    }
    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
  },
  removeCartItem(state, cartItem) {
    state.cartItems.splice(cartItem, 1);
  },
  updateQuantity(state, cartItem) {
    state.cartItems[cartItem].quantity = quantity;
  },
};

export const actions = {
  loadCardItems({ commit }) {
    let cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
      commit("loadCardItems", JSON.parse(cartItems));
    }
  },
};
