import './helpcenter.scss';
import React from 'react';
import { renderTemplate } from '../news.template.component/news.template';

const helpCenterData = {
  "blocks" : [
      {
          "id" : "sMPwmFTlFW",
          "type" : "header",
          "data" : {
              "text" : "Overview of App",
              "level" : 2
          }
      },
      {
          "id" : "cfr5J5s1cB",
          "type" : "paragraph",
          "data" : {
              "text" : "JournalBrew is a platform for news readers and writers. With our vision to support Open Journalism and a neutral reading experience to our readers, we are excited to build tools in this path. As a user, you can be a reader as well as a writer. To become a writer, all it takes is you to signup with your Google account."
          }
      },
      {
          "id" : "ppWOK1xv69",
          "type" : "header",
          "data" : {
              "text" : "For Writers",
              "level" : 2
          }
      },
      {
          "id" : "cQiTro2OcK",
          "type" : "paragraph",
          "data" : {
              "text" : "As a Writer, you get to write about anything that interests you sports, politics, stock market etc. As our platform is in a early stage we cannot offer any fact check automated tool. So it is recommended for Writers to write news which are correct and provide appropriate image and video links wherever necessary. We are expecting to release an automated fact check mechanism in place soon."
          }
      },
      {
          "id" : "o5S4lEAUQN",
          "type" : "header",
          "data" : {
              "text" : "For Readers",
              "level" : 2
          }
      },
      {
          "id" : "mhQjsbJsfW",
          "type" : "paragraph",
          "data" : {
              "text" : "As a reader, you are free to read any article you like and bookmark it for future reference. We offer an ad-free reading experience. As our platform is in a early stage, we expect readers to be conscious while reading articles and source check news being published. We will soon offer an automated process that will fact check news being published on this platform and safeguard our readers from fake news."
          }
      },
      {
          "id" : "uttpMV8uTz",
          "type" : "header",
          "data" : {
              "text" : "Customer Support",
              "level" : 2
          }
      },
      {
          "id" : "JOQUaW1tws",
          "type" : "paragraph",
          "data" : {
              "text" : "For any queries, feedback or issues. Users can email to this Email ID <a href=\"mailto:vivek.journalbrew@gmail.com\">vivek.journalbrew@gmail.com</a> or WhatsApp to <strong>+919679169901</strong>. We are thankful for you to be part of our journey."
          }
      }
  ],
};


const HelpCenter = () => {
  return (
    <div className='helpcenter-wrapper'>
      <h1 className="font-cormorant">Help Center</h1>
      <div>
      { renderTemplate(helpCenterData.blocks) }
      </div>
    </div>
  )
}
export default HelpCenter;