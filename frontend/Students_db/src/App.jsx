import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", age: "", course: "" });
  const [editId, setEditId] = useState(null);

  // 🟢 Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 🟡 Form input handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add or Update Student
  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/students/${editId}`, form);
      } else {
        await axios.post("http://localhost:5000/students", form);
      }
      setForm({ name: "", age: "", course: "" });
      setEditId(null);
      fetchStudents();
    } catch (err) {
      console.error("Submit error", err);
    }
  };

  // ✏️ Edit Mode
  const handleEdit = (student) => {
    setForm({ name: student.name, age: student.age, course: student.course });
    setEditId(student._id);
  };

  // ❌ Delete student
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🎓 Student Management</h1>

      <div className="flex gap-2 mb-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 w-1/3"
        />
        <input
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Age"
          className="border p-2 w-1/3"
        />
        <input
          name="course"
          value={form.course}
          onChange={handleChange}
          placeholder="Course"
          className="border p-2 w-1/3"
        />
      </div>

      <button
        onClick={handleSubmit}
        className={`mb-6 px-4 py-2 text-white rounded ${editId ? "bg-yellow-500" : "bg-green-600"}`}
      >
        {editId ? "Update Student" : "Add Student"}
      </button>

      <ul className="space-y-2">
        {students.map((student) => (
          <li key={student._id} className="border p-3 rounded flex justify-between items-center">
            <span>{student.name} — Age: {student.age} — Course: {student.course}</span>
            <div className="space-x-2">
              <button onClick={() => handleEdit(student)} className="bg-yellow-400 px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(student._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
