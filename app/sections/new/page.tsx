export default function NewSectionPage() {
  return (
    <main>
      <h1>Create Section</h1>

       <form>
        <div>
          <label>Section Name</label>
          <input type="text" />
        </div>

        <div>
          <label>Description</label>
          <textarea />
        </div>

        <button type="submit">
          Create Section
        </button>
      </form>
    </main>
  );
}