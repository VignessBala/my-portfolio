import React from "react";
import Form from "./Form";
import bottom_bg from "../../assets/bg_down.png"

const Contact = () => {
    return(
        <section className="myself" id="contact">
            <div className="contact_section">
                <div className="contact_body">
                    <div className="contact_left">
                        <div className="contact_details">
                            <p className="contact_link">GET IN TOUCH</p>
                            <p className="contact_detail">Wanna Talk? Ping Me</p>
                        </div>
                    </div>
                    <div className="contact_right">
                        <Form />    
                    </div>
                </div>
            </div>
            <div className="bg_down">
                <img className="grediant_img" src={bottom_bg} alt="Background Image"></img>
            </div>
        </section>
    )
}

export default Contact;