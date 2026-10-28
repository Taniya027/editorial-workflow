export default function NewSectionPage() {
  return (
    <main>
      <h1>Create Section</h1>

      <form>
        <div>
          <label>Section Name</label>
          <input
            type="text"
            placeholder="Politics"
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            placeholder="Section description"
          />
        </div>

        <button type="submit">
          Create Section
        </button>
      </form>
    </main>
  );
}