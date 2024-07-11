import React, { useContext, useState } from "react";
import "./CartItems.css";
import cross_icon from "../Assets/cart_cross_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";

const CartItems = () => {
  const { products, cartItems, removeFromCart, getTotalCartAmount } = useContext(ShopContext);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  // Function to handle dummy payment
  const handleDummyPayment = () => {
    alert('Payment successful!'); 
  };

  const handleCouponSubmit = () => {
    if (couponCode === "SHOPPEE50") {
      applyCouponDiscount();
    } else {
      setCouponMessage("Invalid coupon code");
    }
  };

  const applyCouponDiscount = () => {

    const subtotal = getTotalCartAmount();

    const discount = subtotal * 0.5;

    setDiscountAmount(discount);

    const updatedProducts = products.map((product) => {
      if (cartItems[product.id] > 0) {
        return {
          ...product,
          new_price: product.new_price * 0.5
        };
      }
      return product;
    });

    setCouponMessage(`50% discount applied - You saved ${currency}${discount.toFixed(2)}`);
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {products.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems-format-main cartitems-format">
                <img className="cartitems-product-icon" src={backend_url + e.image} alt="" />
                <p className="cartitems-product-title">{e.name}</p>
                <p>{currency}{e.new_price}</p>
                <button className="cartitems-quantity">{cartItems[e.id]}</button>
                <p>{currency}{e.new_price * cartItems[e.id]}</p>
                <img
                  onClick={() => removeFromCart(e.id)}
                  className="cartitems-remove-icon"
                  src={cross_icon}
                  alt=""
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}
      
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>{currency}{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Discount</p>
              <p>{currency}{discountAmount.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>{currency}{(getTotalCartAmount() - discountAmount).toFixed(2)}</h3>
            </div>
          </div>
          <button onClick={handleDummyPayment}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>Redeem Coupon code</p>
          <div className="cartitems-promobox">
            <input
              type="text"
              placeholder="Enter promo code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button onClick={handleCouponSubmit}>Submit</button>
          </div>
          {couponMessage && <p>{couponMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default CartItems;
