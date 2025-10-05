
import React from 'react';
import './About.css';

const teamMembers = [
  {
    name: 'Rachit Khadka',
    role: 'Full Stack Developer',
    bio: 'Experienced in developing scalable web applications across both frontend and backend environments. ',
  },
  {
    name: 'Prinsa Neupane',
    role: 'Frontend Developer',
    bio: 'Focused on designing and implementing responsive, user-friendly interfaces.',
  },
  {
    name: 'Pratyush Badal',
    role: 'Backend Developer',
    bio: 'Specializes in building secure, efficient server-side systems and managing data integrations.',
  },
  {
    name: 'Rahul Adhikari',
    role: 'Content and Presentation Lead',
    bio: ' Leads the creation and delivery of clear, impactful content and presentations.',
  },
];

const About = () => {
  return (
    <div className="container">
      <div className="team-header">
        <h1 className="team-name">KEPLER'S</h1>
        <p className="team-tagline">Innovation in Motion</p>
      </div>

      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div className="member-card" key={index}>
            <h2 className="member-name">{member.name}</h2>
            <div className="member-role">{member.role}</div>
            <p className="member-bio">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
    