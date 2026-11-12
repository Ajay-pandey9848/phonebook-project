
import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:3001/api/persons";

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Load contacts from MongoDB when the app opens
  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Could not load contacts");
        }

        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error("Error loading contacts:", error);
        alert("Could not connect to the Phonebook backend.");
      } finally {
        setLoading(false);
      }
    };

    getContacts();
  }, []);

  // Add a new contact to MongoDB
  const addContact = async (e) => {
    e.preventDefault();

    if (!name.trim() || !number.trim()) {
      alert("Please enter both name and phone number.");
      return;
    }

    const newContact = {
      name: name.trim(),
      number: number.trim(),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      });

      if (!response.ok) {
        throw new Error("Could not add contact");
      }

      const savedContact = await response.json();

      setContacts((previousContacts) => [
        ...previousContacts,
        savedContact,
      ]);

      setName("");
      setNumber("");

      alert("Contact saved successfully!");
    } catch (error) {
      console.error("Error adding contact:", error);
      alert("Could not save contact. Please try again.");
    }
  };

  // Delete a contact from MongoDB
  const deleteContact = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete contact");
      }

      setContacts((previousContacts) =>
        previousContacts.filter((contact) => contact._id !== id)
      );
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Could not delete contact. Please try again.");
    }
  };

  // Search contacts
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <h1>Phonebook</h1>
        <p>Manage your contacts easily</p>
      </header>

      <main className="container">
        <section className="form-section">
          <h2>Add New Contact</h2>

          <form onSubmit={addContact}>
            <input
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="tel"
              placeholder="Enter phone number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />

            <button type="submit">Add Contact</button>
          </form>
        </section>

        <section className="contacts-section">
          <div className="contacts-heading">
            <h2>My Contacts</h2>
            <span>{contacts.length} Contacts</span>
          </div>

          <input
            className="search-input"
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="contact-list">
            {loading ? (
              <p className="empty-message">Loading contacts...</p>
            ) : filteredContacts.length === 0 ? (
              <p className="empty-message">
                No contacts found. Add your first contact!
              </p>
            ) : (
              filteredContacts.map((contact) => (
                <div className="contact-card" key={contact._id}>
                  <div>
                    <h3>{contact.name}</h3>
                    <p>{contact.number}</p>
                  </div>

                  <button
                    className="delete-button"
                    onClick={() => deleteContact(contact._id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <footer>
        <p>Phonebook Application | Built with React</p>
      </footer>
    </div>
  );
}

export default App;
