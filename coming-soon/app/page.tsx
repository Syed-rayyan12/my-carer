export default function ComingSoonPage() {
  return (
    <>
<svg className="iconDefinitions" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
  <symbol id="heart" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></symbol>
  <symbol id="house" viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-8H9v8H4a1 1 0 0 1-1-1Z"/></symbol>
  <symbol id="sparkles" viewBox="0 0 24 24"><path d="m12 3 3 6 6 3-6 3-3 6-3-6-6-3 6-3Zm8-2v4m-2-2h4"/></symbol>
  <symbol id="arrow" viewBox="0 0 24 24"><path d="M6 18 18 6M6 6h12v12"/></symbol>
</defs></svg>
<main className="page"><div className="shell">
  <header className="header">
    <img src="/logo.png" alt="My Carer" width="122" height="79" className="logo" />
    <span className="status"><span></span> A little care in the making</span>
  </header>
  <section className="hero" aria-labelledby="coming-soon-title">
    <div className="copy">
      <p className="eyebrow"><svg className="icon" width="15" height="15" aria-hidden="true"><use href="#sparkles"/></svg> SOMETHING GOOD IS COMING</p>
      <h1 id="coming-soon-title">Great care.<br />Closer to <span>home.</span></h1>
      <p className="description">Finding the right care should feel reassuring. We’re creating a more personal way to connect families, caregivers and care organisations.</p>
      <div className="launch"><span className="launchIcon"><svg className="icon" width="25" height="25" aria-hidden="true"><use href="#arrow"/></svg></span><div><strong>Coming soon</strong><p>Thoughtfully built. With you in mind.</p></div></div>
      <div className="audiences"><span>For families</span><i></i><span>For caregivers</span><i></i><span>For organisations</span></div>
    </div>
    <div className="art" aria-hidden="true">
      <div className="orbit"></div><div className="orbitInner"></div>
      <span className="starOne">✳</span><span className="starTwo">✦</span>
      <div className="photoFrame">
        <img src="/images/about-hero.png" alt="" width="1409" height="1581" fetchPriority="high" className="photo" />
        <div className="photoShade"></div>
        <div className="photoCaption"><svg className="icon filled" width="23" height="23"><use href="#heart"/></svg><span>A little connection.<br /><strong>A lot of care.</strong></span></div>
      </div>
      <div className="careCard"><span><svg className="icon" width="28" height="28"><use href="#heart"/></svg></span><div><strong>People at the heart</strong><p>of everything we’re building</p></div></div>
      <div className="homeBadge"><svg className="icon" width="23" height="23"><use href="#house"/></svg><span>Care starts<br /><strong>with connection.</strong></span></div>
      <span className="artNote">A brighter chapter in care.</span>
    </div>
  </section>
  <footer className="footer"><p>Care is personal. Finding it should be too.</p><span>© My Carer</span><span className="footerHeart">Made with care <svg className="icon" width="13" height="13" aria-hidden="true"><use href="#heart"/></svg></span></footer>
</div></main>
    </>
  );
}
