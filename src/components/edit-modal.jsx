export default function EditModal({ value, setValue, onSave, onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Edit Task</h3>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div>
          <button onClick={onSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
  },
};