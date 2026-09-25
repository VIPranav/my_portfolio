import { requireAdmin } from "@/lib/auth";
import ProjectForm from "@/components/admin/ProjectForm";
export default async function NewProject() {
  await requireAdmin();
  return (
    <>
      <h1>New project</h1>
      <ProjectForm />
    </>
  );
}
