import React from 'react'
import './Footer.css'

import footer_logo from '../Assets/logo_big.png'
import instagram_icon from '../Assets/instagram_icon.png'
import facebook_icon from '../Assets/facebook_icon.png'
import x_icon from '../Assets/x_icon.png'

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-logo">
        <img src={footer_logo} alt="" />
        <p>SHOPPEE</p>
      </div>
      <ul className="footer-links">
        <li>Shop</li>
        <li>Terms and Conditions</li>
        <li>Returns and Refunds</li>
        <li>About us</li>
        <li>Contact us</li>
      </ul>
      <div className="footer-social-icons">
        <div className="footer-icons-container">
            <img src={instagram_icon} alt="" />
        </div>
        <div className="footer-icons-container">
            <img src={facebook_icon} alt="" />
        </div>
        <div className="footer-icons-container">
            <img src={x_icon} alt="" />
        </div>
      </div>
      <div className="footer-intro">
        <hr />
        <p>Welcome to Shopee, your go-to destination for stylish and affordable clothing online. Explore our curated collection of trendy outfits, comfortable basics, and fashion-forward accessories. Shop confidently with our easy-to-navigate interface and secure checkout. Start upgrading your wardrobe today at Shopee.
        </p>
      </div>
    </div>
  )
}

export default Footer
