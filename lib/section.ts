export interface CreateSectionParams {
  name?: string;
  description?: string;
  ownerEditorId?: string;
}

export async function createSection(params?: CreateSectionParams) {
  void params;
  return null;
}

export async function updateSection(id?: string, params?: CreateSectionParams) {
  void id;
  void params;
  return null;
}

export async function deleteSection(id?: string) {
  void id;
  return null;
}

export async function getSectionById(id?: string) {
  void id;
  return null;
}