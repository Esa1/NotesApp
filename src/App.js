import React, { useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
//import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
    /**
     * Challenge: When the user edits a note, reposition
     * it in the list of notes to the top of the list
     */
    const [notes, setNotes] = React.useState(
        () => JSON.parse(localStorage.getItem("notes")) || []
    )
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )
    
    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes])
    
    function createNewNote() {
        console.log("createNewNote")
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {
        console.log("***UPDATENOTE---")
        function currentNoteTest(note) {
            if (currentNoteId == note.id)
                return true
            else
                return false
        }

/*        setNotes(oldNotes => oldNotes.map(oldNote => {
            return oldNote.id === currentNoteId
                ? { ...oldNote, body: text }
                : oldNote
        }))*/

        setNotes(oldNotes => {
            const updatedNotes = oldNotes.map(oldNote => {
            return oldNote.id === currentNoteId
                ? { ...oldNote, body: text }
                : oldNote
            })
            let orderChanged = []
            const id = updatedNotes.findIndex(currentNoteTest)
            if (id > 0) {
                const startPart = updatedNotes.slice(0, id)
                const updated = updatedNotes.slice(id, id+1)
                const endPart = updatedNotes.slice(id+1)
                orderChanged = [
                    ...updated,
                    ...startPart,
                    ...endPart
                ]
                return orderChanged
            }
            else
                return updatedNotes
        })

/*        const id = notes.findIndex(currentNoteTest)
        console.log("ID===" + id)
        if (id > 0) {
            const startPart = notes.slice(0, id)
            const updated = notes.slice(id, id+1)
            const endPart = notes.slice(id+1)
            console.log("startPart= " + startPart)
            console.log("startPart0= " + startPart[0].body)
            console.log("updated= " + updated)
            console.log("endPart= " + endPart)
            setNotes(prevNotes => [
                ...updated,
                ...startPart,
                ...endPart
            ])
        }*/
        console.log("---UPDATENOTE***")
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
