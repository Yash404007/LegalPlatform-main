import { fetchLawyers } from "@/actions/lawyer-filtering"
import { LawyerFilterSort } from "@/components/Global/LawyerPromptDialogue"

export default async function Home() {
  const initialLawyers = await fetchLawyers({})

  return (
    <main className="container mt-20 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Lawyers</h1>
      <LawyerFilterSort initialLawyers={initialLawyers} />
    </main>
  )
}

