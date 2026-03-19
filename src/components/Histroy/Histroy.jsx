import React, { useState } from 'react';
import { profile } from "../../data/profile";

const educationItems = [
  {
    title: profile.education.degree,
    subtitle: `${profile.education.school} | ${profile.education.score}`,
    period: "2017 - 2021",
  },
];

const renderTimeline = (items) =>
  items.map((item, index) => {
    const isLeft = index % 2 === 0;
    const showLine = index !== items.length - 1;

    return (
      <div className="qualification__data" key={`${item.title}-${item.period}`}>
        {isLeft ? (
          <>
            <div>
              <h3 className="qualification__title">{item.title}</h3>
              <span className="qualification__subtitle">{item.subtitle}</span>
              <div className="qualification__calendar">
                <span className='qualify_icon'>
                  <svg xmlns="http://www.w3.org/2000/svg" className='qualify_iconsz' viewBox="0 0 24 24" fill="none">
                    <path d="M14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C20.1752 21.4816 19.3001 21.7706 18 21.8985" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M7 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M17 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M21.5 9H16.625H10.75M2 9H5.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
                <p className='qualification_p'>{item.period}</p>
              </div>
            </div>

            <div>
              <span className="qualification__rounder"></span>
              {showLine ? <span className="qualification__line"></span> : null}
            </div>
            <div className="empty"></div>
          </>
        ) : (
          <>
            <div className="empty"></div>
            <div>
              <span className="qualification__rounder"></span>
              {showLine ? <span className="qualification__line"></span> : null}
            </div>
            <div>
              <h3 className="qualification__title">{item.title}</h3>
              <span className="qualification__subtitle">{item.subtitle}</span>
              <div className="qualification__calendar">
                <span className='qualify_icon'>
                  <svg xmlns="http://www.w3.org/2000/svg" className='qualify_iconsz' viewBox="0 0 24 24" fill="none">
                    <path d="M14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C20.1752 21.4816 19.3001 21.7706 18 21.8985" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M7 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M17 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M21.5 9H16.625H10.75M2 9H5.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
                <p className='qualification_p'>{item.period}</p>
              </div>
            </div>
          </>
        )}
      </div>
    );
  });

const Histroy =() =>{
        const [selectedCategory, setSelectedCategory] = useState('experience');

        const handleCategorySelection = (category) => {
            setSelectedCategory(category);
        };
    return(
        <section id="history">
            <div className='history_bg'></div>
            <div className="histroy_content">
                    <div className='history_svg'>
                        <svg className="svg_his" width="585" height="475" viewBox="0 0 585 475" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M59.6878 70.4072C2.64247 112.7 -16.8108 220.14 15.7866 303.15C34.714 338.439 85.6079 417.473 137.764 451.308C202.958 493.601 346.492 482.305 380.666 392.728C414.841 303.151 608.848 251.138 582.56 142.122C556.271 33.1053 429.562 31.2664 323.621 6.83623C217.68 -17.5939 116.733 28.1141 59.6878 70.4072Z" fill="#B071FF"/>
                        </svg>
                    </div>
                <div className="myself_header">
                    <p className="myself_t1">Qualification</p>
                    <p className="myself_t2">My Journey</p>
                </div>
                <div className="histroy_body">
                    <div className="histroy_toggle">
                        <div className={`histroy_experience ${selectedCategory === 'experience' ? 'column_active' : ''}`} onClick={() => handleCategorySelection('experience')}>
                            <div className="histroy_icon_hat">
                            <svg xmlns="http://www.w3.org/2000/svg" className="histroy_iconsz" viewBox="0 0 24 24" fill="none">
                                <path d="M21.6618 8.71973C18.6519 10.6761 17.147 11.6543 15.5605 12.1472C13.2416 12.8677 10.7586 12.8677 8.43963 12.1472C6.85313 11.6543 5.34822 10.6761 2.33838 8.71973" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M8 11V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M16 11V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M22 14C22 10.2288 22 8.34315 20.8284 7.17157C20.0781 6.42122 19.0348 6.15144 17.3909 6.05445C16.468 6 15.3559 6 14 6H10C8.64413 6 7.53199 6 6.60915 6.05445C4.96519 6.15144 3.92193 6.42122 3.17157 7.17157C2 8.34315 2 10.2288 2 14C2 17.7712 2 19.6569 3.17157 20.8284C4.34315 22 6.22876 22 10 22H14C17.7712 22 19.6569 22 20.8284 20.8284C21.4816 20.1752 21.7706 19.3001 21.8985 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            </div>
                           <p className="histriy_heading_txt">Experience</p> 
                        </div>
                        <div className={`histroy_education ${selectedCategory === 'education' ? 'column_active' : ''}`} onClick={() => handleCategorySelection('education')}>
                            <div className="histroy_icon_hat">
                                <svg xmlns="http://www.w3.org/2000/svg" className="histroy_iconsz" viewBox="0 0 24 24" fill="none">
                                    <path d="M9.78272 3.49965C11.2037 2.83345 12.7962 2.83345 14.2172 3.49965L20.9084 6.63664C22.3639 7.31899 22.3639 9.68105 20.9084 10.3634L14.2173 13.5003C12.7963 14.1665 11.2038 14.1665 9.78281 13.5003L3.0916 10.3634C1.63613 9.68101 1.63614 7.31895 3.0916 6.63659L6 5.27307" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path d="M2 8.5V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path d="M12 21C10.204 21 7.8537 19.8787 6.38533 19.0656C5.5035 18.5772 5 17.6334 5 16.6254V11.5M19 11.5V16.6254C19 17.6334 18.4965 18.5772 17.6147 19.0656C17.0843 19.3593 16.4388 19.6932 15.7459 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </div>
                          <p className="histriy_heading_txt">Education</p>
                            
                        </div>
                    </div>
                    <div className="histroy_timeline">
                    <div className={`histroy_experience_section ${selectedCategory === 'experience' ? 'display_block' : 'display_none'}`}>
                        {renderTimeline(
                          profile.experience.map((item) => ({
                            title: item.role,
                            subtitle: `${item.company}${item.client ? ` | ${item.client}` : ""}`,
                            period: item.period,
                          })),
                        )}
                    </div>
                    <div className={`histroy_education_section ${selectedCategory === 'education' ? 'display_block' : 'display_none'}`}>
                      {renderTimeline(educationItems)}
                    </div>
                </div>
                </div>
            </div>
        </section>
    );

};

export default Histroy
