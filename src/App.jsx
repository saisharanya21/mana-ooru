import { useEffect, useState } from "react";

const categories = [
  { name: "Roads", icon: "🛣️", description: "Potholes and damaged roads" },
  { name: "Garbage", icon: "♻️", description: "Waste collection issues" },
  { name: "Water", icon: "💧", description: "Water supply problems" },
  { name: "Streetlights", icon: "💡", description: "Faulty streetlights" },
  { name: "Drainage", icon: "🚰", description: "Blocked drainage" },
  { name: "Other", icon: "📢", description: "Other community issues" }
];

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(
    localStorage.getItem("manaUser") || ""
  );

  const [complaints, setComplaints] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("manaComplaints")
      ) || [];
    } catch {
      return [];
    }
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "manaComplaints",
      JSON.stringify(complaints)
    );
  }, [complaints]);

  function navigate(destination) {
    setPage(destination);
    window.scrollTo(0, 0);
  }

  function login(name) {
    setUser(name);
    localStorage.setItem("manaUser", name);
    navigate("dashboard");
  }

  function logout() {
    setUser("");
    localStorage.removeItem("manaUser");
    navigate("home");
  }

  function addComplaint(complaint) {
    const newComplaint = {
      ...complaint,
      id: "MO-" + Date.now().toString().slice(-6),
      date: new Date().toLocaleDateString("en-IN"),
      status: "Pending"
    };

    setComplaints(previous => [
      newComplaint,
      ...previous
    ]);

    setMessage("Complaint submitted successfully!");
    navigate("complaints");
  }

  function updateStatus(id, status) {
    setComplaints(previous =>
      previous.map(item =>
        item.id === id ? { ...item, status } : item
      )
    );
  }

  return (
    <div>
      <header className="navbar">
        <button className="logo" onClick={() => navigate("home")}>
          <span className="logo-icon">మ</span>
          <span>Mana<span className="green">Ooru</span></span>
        </button>

        <nav>
          <button onClick={() => navigate("home")}>Home</button>
          <button onClick={() => navigate("dashboard")}>Dashboard</button>
          <button onClick={() => navigate("complaints")}>Complaints</button>
          <button onClick={() => navigate("admin")}>Admin</button>
        </nav>

        <div className="nav-right">
          {user ? (
            <>
              <span className="welcome">Hi, {user}</span>
              <button className="outline-btn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <button
              className="primary-btn"
              onClick={() => navigate("login")}
            >
              Login / Signup
            </button>
          )}
        </div>
      </header>

      {message && (
        <div className="toast" onClick={() => setMessage("")}>
          {message} ✕
        </div>
      )}

      {page === "home" && (
        <Home navigate={navigate} />
      )}

      {page === "login" && (
        <Login onLogin={login} />
      )}

      {page === "dashboard" && (
        <Dashboard
          user={user}
          complaints={complaints}
          navigate={navigate}
        />
      )}

      {page === "submit" && (
        <SubmitComplaint onSubmit={addComplaint} />
      )}

      {page === "complaints" && (
        <Complaints complaints={complaints} />
      )}

      {page === "admin" && (
        <Admin
          complaints={complaints}
          updateStatus={updateStatus}
        />
      )}

      <footer>
        <h2>ManaOoru 🌱</h2>
        <p>Your Voice. Your Community. Your Solution.</p>
        <small>© 2026 ManaOoru | Community Support Platform</small>
      </footer>
    </div>
  );
}

function Home({ navigate }) {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="tag">YOUR COMMUNITY, YOUR VOICE</span>

          <h1>
            Together, let's build a
            <span className="green"> Better Ooru.</span>
          </h1>

          <p>
            Every neighbourhood deserves to be heard.
            Report local problems using your voice or text
            and track their progress with ManaOoru.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn big-btn"
              onClick={() => navigate("submit")}
            >
              Report an Issue →
            </button>

            <button
              className="outline-btn big-btn"
              onClick={() => navigate("dashboard")}
            >
              Explore Dashboard
            </button>
          </div>

          <div className="hero-note">
            🌿 Simple reporting · Community participation · Better living
          </div>
        </div>

        <div className="hero-art">
          <div className="circle-art">
            <span>మన ఊరు</span>
            <small>OUR COMMUNITY</small>
            <div>🌳</div>
          </div>
          <div className="floating-card">
            🎙️ Speak your concern
          </div>
          <div className="floating-card second-card">
            ✅ Track your complaint
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="tag">HOW IT WORKS</span>
          <h2>Making change starts with one voice.</h2>
          <p>Three simple steps to improve your neighbourhood.</p>
        </div>

        <div className="steps">
          <div className="step-card">
            <span>01</span>
            <div>🎙️</div>
            <h3>Speak or Type</h3>
            <p>Describe your community problem in your preferred language.</p>
          </div>

          <div className="step-card">
            <span>02</span>
            <div>📝</div>
            <h3>Submit Complaint</h3>
            <p>Choose the category and provide the issue location.</p>
          </div>

          <div className="step-card">
            <span>03</span>
            <div>📊</div>
            <h3>Track Progress</h3>
            <p>Follow your complaint until it gets resolved.</p>
          </div>
        </div>
      </section>

      <section className="section category-section">
        <div className="section-heading">
          <span className="tag">COMMUNITY ISSUES</span>
          <h2>What needs attention?</h2>
        </div>

        <div className="category-grid">
          {categories.map(category => (
            <div className="category-card" key={category.name}>
              <span>{category.icon}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <h2>Your Ooru. Your Responsibility. Your Voice.</h2>
        <p>Start making a difference today.</p>
        <button
          className="white-btn"
          onClick={() => navigate("submit")}
        >
          Submit a Complaint →
        </button>
      </section>
    </>
  );
}

function Login({ onLogin }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (name.trim()) {
      onLogin(name.trim());
    }
  }

  return (
    <section className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <span className="tag">WELCOME TO MANAOORU</span>
        <h2>Welcome!</h2>
        <p>Enter your name to access the demo dashboard.</p>

        <label>Your name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />

        <button className="primary-btn full-btn">
          Continue →
        </button>

        <small>Demo login only. Real authentication requires backend integration.</small>
      </form>
    </section>
  );
}

function Dashboard({ user, complaints, navigate }) {
  const pending = complaints.filter(c => c.status === "Pending").length;
  const progress = complaints.filter(c => c.status === "In Progress").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="tag">YOUR DASHBOARD</span>
          <h1>Hello{user ? `, ${user}` : ""}! 👋</h1>
          <p>Here's an overview of community complaints.</p>
        </div>

        <button className="primary-btn" onClick={() => navigate("submit")}>
          + Report Issue
        </button>
      </div>

      <div className="stats">
        <Stat title="Total Complaints" value={complaints.length} />
        <Stat title="Pending" value={pending} />
        <Stat title="In Progress" value={progress} />
        <Stat title="Resolved" value={resolved} />
      </div>

      <div className="panel">
        <div className="panel-heading">
          <h2>Recent Complaints</h2>
          <button className="text-btn" onClick={() => navigate("complaints")}>
            View All →
          </button>
        </div>

        <ComplaintList complaints={complaints.slice(0, 5)} />
      </div>
    </section>
  );
}

function Stat({ title, value }) {
  return (
    <div className="stat-card">
      <span>✳</span>
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}

function SubmitComplaint({ onSubmit }) {
  const [category, setCategory] = useState("Roads");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("en-IN");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [recognition, setRecognition] = useState(null);

  function startVoice() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice recognition is not supported in this browser. Please type instead.");
      return;
    }

    const speech = new SpeechRecognition();
    speech.lang = language;
    speech.continuous = true;
    speech.interimResults = true;

    speech.onresult = event => {
      let result = "";

      for (let i = 0; i < event.results.length; i++) {
        result += event.results[i][0].transcript;
      }

      setDescription(result);
    };

    speech.onerror = () => {
      setError("Microphone access failed. Please check browser permissions.");
      setListening(false);
    };

    speech.onend = () => setListening(false);

    setRecognition(speech);
    setError("");

    try {
      speech.start();
      setListening(true);
    } catch {
      setError("Unable to start voice recognition. Please try again.");
    }
  }

  function stopVoice() {
    recognition?.stop();
    setListening(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (description.trim().length < 5 || !location.trim()) {
      setError("Please enter your complaint and location.");
      return;
    }

    onSubmit({
      category,
      description: description.trim(),
      location: location.trim()
    });
  }

  return (
    <section className="form-page">
      <form className="form-card wide-form" onSubmit={handleSubmit}>
        <span className="tag">MAKE YOUR VOICE HEARD</span>
        <h1>Report a Community Issue</h1>
        <p>Tell us what needs attention in your neighbourhood.</p>

        <label>Choose Language</label>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="en-IN">English</option>
          <option value="te-IN">Telugu</option>
          <option value="hi-IN">Hindi</option>
        </select>

        <div className="voice-box">
          <span>🎙️</span>
          <div>
            <b>{listening ? "Listening..." : "Voice Complaint"}</b>
            <p>Speak naturally to describe your issue.</p>
          </div>

          <button
            type="button"
            className={listening ? "stop-btn" : "primary-btn"}
            onClick={listening ? stopVoice : startVoice}
          >
            {listening ? "Stop" : "Start Speaking"}
          </button>
        </div>

        <label>Describe your complaint</label>
        <textarea
          rows="5"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Type your complaint here..."
          required
        />

        <label>Complaint Category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {categories.map(c => (
            <option key={c.name}>{c.name}</option>
          ))}
        </select>

        <label>Issue Location</label>
        <input
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Enter area, street or landmark"
          required
        />

        {error && <p className="error">{error}</p>}

        <button className="primary-btn full-btn" type="submit">
          Submit Complaint →
        </button>
      </form>
    </section>
  );
}

function ComplaintList({ complaints }) {
  if (!complaints.length) {
    return (
      <div className="empty">
        <span>📋</span>
        <h3>No complaints yet</h3>
        <p>Submitted complaints will appear here.</p>
      </div>
    );
  }

  return (
    <div className="complaint-list">
      {complaints.map(c => (
        <div className="complaint-item" key={c.id}>
          <div>
            <b>{c.category}</b>
            <p>{c.description}</p>
            <small>
              {c.id} · {c.location} · {c.date}
            </small>
          </div>

          <Status status={c.status} />
        </div>
      ))}
    </div>
  );
}

function Status({ status }) {
  return (
    <span className={`status ${status.toLowerCase().replace(" ", "-")}`}>
      {status}
    </span>
  );
}

function Complaints({ complaints }) {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All"
    ? complaints
    : complaints.filter(c => c.status === filter);

  return (
    <section className="page">
      <span className="tag">REPORT HISTORY</span>
      <h1>My Complaints</h1>
      <p>Track the progress of submitted issues.</p>

      <div className="filters">
        {["All", "Pending", "In Progress", "Resolved"].map(f => (
          <button
            key={f}
            className={filter === f ? "filter-active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="panel">
        <ComplaintList complaints={filtered} />
      </div>
    </section>
  );
}

function Admin({ complaints, updateStatus }) {
  return (
    <section className="page">
      <span className="tag">ADMINISTRATION · DEMO</span>
      <h1>Admin Dashboard</h1>
      <p>View complaints and update their demo status.</p>

      <div className="stats">
        <Stat title="Total" value={complaints.length} />
        <Stat title="Pending" value={complaints.filter(c => c.status === "Pending").length} />
        <Stat title="In Progress" value={complaints.filter(c => c.status === "In Progress").length} />
        <Stat title="Resolved" value={complaints.filter(c => c.status === "Resolved").length} />
      </div>

      <div className="panel">
        <h2>Manage Complaints</h2>

        {complaints.length === 0 ? (
          <div className="empty">No complaints to manage.</div>
        ) : (
          complaints.map(c => (
            <div className="admin-item" key={c.id}>
              <div>
                <b>{c.id} · {c.category}</b>
                <p>{c.description}</p>
                <small>{c.location}</small>
              </div>

              <select
                value={c.status}
                onChange={e => updateStatus(c.id, e.target.value)}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
          ))
        )}
      </div>

      <p className="demo-note">
        Demo only: real admin authentication and complaint management
        must be implemented using a secure backend.
      </p>
    </section>
  );
}

export default App;