import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/router'

export default function PdfForm() {
    const [file, setFile] = useState<File | null>(null)
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!file) return alert('Please select a PDF')

        setLoading(true)
        const form = new FormData()
        form.append('pdf', file)
        form.append('description', text)

        const res = await fetch('localhost:5000/', {
            method: 'POST',
            body: form,
        })

        setLoading(false)
        if (res.ok) {
            alert('Sent successfully!')
            router.replace('/')
        } else {
            alert('Error sending: ' + (await res.text()))
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block font-medium">PDF File</label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="mt-1"
                />
            </div>
            <div>
                <label className="block font-medium">Description</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="mt-1 w-full border rounded p-2"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                {loading ? 'Sending…' : 'Send to Flask'}
            </button>
        </form>
    )
}
