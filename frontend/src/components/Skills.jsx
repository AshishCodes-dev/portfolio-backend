import React from 'react';

export default function Skills() {
  const skillGroups = [
    {
      title: 'Languages & Markup',
      skills: [
        { icon: '🌐', name: 'HTML5' },
        { icon: '🎨', name: 'CSS3' },
        { icon: '⚡', name: 'JavaScript' },
        { icon: '🐍', name: 'Python' },
        { icon: '🔵', name: 'C' },
        { icon: '🔷', name: 'C++' },
      ],
    },
    {
      title: 'Frontend',
      skills: [
        { icon: '⚛️', name: 'React.js' },
        { icon: '▲', name: 'Next.js' },
        { icon: '💨', name: 'Tailwind CSS' },
      ],
    },
    {
      title: 'Backend',
      skills: [
        { icon: '🟢', name: 'Node.js' },
        { icon: '🚂', name: 'Express.js' },
      ],
    },
    {
      title: 'Database',
      skills: [
        { icon: '🍃', name: 'MongoDB' },
        { icon: '🐘', name: 'PostgreSQL' },
        { icon: '🗄️', name: 'SQL' },
      ],
    },
    {
      title: 'Tools & DevOps',
      skills: [
        { icon: '🐙', name: 'Git & GitHub' },
        { icon: '🐳', name: 'Docker' },
      ],
    },
  ];

  return (
    <>
      <div className="section-divider"><span>/* SKILLS */</span></div>
      <section className="skills" id="skills">
        <div className="section-header reveal visible">
          <span className="section-tag">what i work with</span>
          <h2 className="section-title">My <span>Skills</span></h2>
        </div>

        <div className="skills-big-container reveal visible">
          <div className="skills-container-header">
            <div className="dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <span className="container-title">skills.config.js</span>
            <span className="container-lines">16 skills loaded</span>
          </div>

          <div className="skills-groups">
            {skillGroups.map((group) => (
              <div className="skill-group" key={group.title}>
                <h3 className="skill-group-title">{group.title}</h3>
                <div className="skill-chips">
                  {group.skills.map((skill) => (
                    <span className="skill-chip" key={skill.name}>
                      <span className="skill-icon">{skill.icon}</span>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
