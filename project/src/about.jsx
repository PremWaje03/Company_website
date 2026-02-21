import "./about.css";

export default function About() {
  const firmDetails = [
    {
      title: "Who We Are",
      desc: "We are a product-focused technology company delivering custom digital platforms for startups and growing businesses.",
    },
    {
      title: "How We Work",
      desc: "Our teams operate in agile cycles, combining engineering quality, transparent communication, and measurable milestones.",
    },
    {
      title: "Our Expertise",
      desc: "Web development, enterprise backend systems, cloud deployment, integration engineering, and ongoing product support.",
    },
    {
      title: "Delivery Standards",
      desc: "Code quality, security-first practices, clean architecture, testing discipline, and documentation-driven handover.",
    },
    {
      title: "Business Outcomes",
      desc: "Faster time-to-market, lower operational risk, stronger customer experience, and scalable digital operations.",
    },
    {
      title: "Our Commitment",
      desc: "Long-term partnership from planning to post-launch optimization with dependable technical ownership.",
    },
  ];

  return (
    <section className="about-page">
      <div className="about-intro">
        <p className="eyebrow">About Our Company</p>
        <h2>Engineering Practical Digital Growth</h2>
        <p>
          We help companies modernize operations and launch products that scale. Our approach combines strong
          engineering standards with clear business understanding.
        </p>
      </div>

      <div className="about-details">
        {firmDetails.map((item) => (
          <article className="about-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
