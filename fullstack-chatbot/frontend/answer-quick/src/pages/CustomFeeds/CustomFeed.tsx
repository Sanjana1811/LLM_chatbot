import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../assets/css/customfeed.css";

type FeedItem = {
  title: string;
  icon: string;
  path: string;
};

const feedItems: FeedItem[] = [
  { title: "Art", icon: "fa-palette", path: "/feed/art" },
  { title: "Entertainment", icon: "fa-film", path: "/feed/entertainment" },
  { title: "Science", icon: "fa-flask", path: "/feed/science" },
  { title: "Technology", icon: "fa-microchip", path: "/feed/tech" },
  { title: "News", icon: "fa-newspaper", path: "/feed/news" },
  { title: "Sports", icon: "fa-football", path: "/feed/sports" },
];

const CustomFeed: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrentIndex(prev =>
      prev === feedItems.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex(prev =>
      prev === 0 ? feedItems.length - 1 : prev - 1
    );
  };

  const trackStyles: React.CSSProperties = {
    transform: `translateX(-${currentIndex * 100}%)`,
    transition: "transform 0.5s ease-in-out",
    display: "flex",
  };

  return (
    <div style={styles.container}>
      <h2>✨ Custom Feed</h2>
      <p>Choose what you want to explore</p>

      <div 
      // style={styles.viewport}
      className="custom-feed-viewport"
      >
        <div style={trackStyles}>
          {feedItems.map((item, index) => (
            <div key={index} style={styles.slide}>
              <div
                style={styles.card}
                onClick={() => navigate(item.path)}
              >
                <i
                  className={`fa-solid ${item.icon}`}
                  style={styles.icon}
                />
                <h3>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <button onClick={prevSlide} 
        className='custom-feed-nav-btn-left'
        // style={{ ...styles.navBtn, left: 10 }}
        >
          ◀
        </button>
        <button onClick={nextSlide} 
        // style={{ ...styles.navBtn, right: 10 }}
        className='custom-feed-nav-btn-right'>
          ▶
        </button>
      </div>
    </div>
  );
};

export default CustomFeed;


/* ✅ ADD STYLES HERE */
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 600,
    margin: "40px auto",
    textAlign: "center",
  },
  viewport: {
    overflow: "hidden",
    position: "relative",
  },
  slide: {
    minWidth: "100%",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: 260,
    height: 180,
    borderRadius: 12,
    background: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  icon: {
    fontSize: 40,
    marginBottom: 10,
  },
  navBtn: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "#000",
    color: "#fff",
    padding: "6px 10px",
    cursor: "pointer",
  },
};
