import React, { useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
//import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
    /**
     * Challenge:
     * 1. Every time the `notes` array changes, save it 
     *    in localStorage. You'll need to use JSON.stringify()
     *    to turn the array into a string to save in localStorage.
     * 2. When the app first loads, initialize the notes state
     *    with the notes saved in localStorage. You'll need to
     *    use JSON.parse() to turn the stringified array back
     *    into a real JS array.
     */
    
    const [notes, setNotes] = React.useState(loadLocalStorage())
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )

    const testNotes = loadLocalStorage()
    
    console.log("testNotes=" + testNotes)
    console.log("NOTES_START= " + notes)
    function saveLocalStorage() {
        console.log("saveLocalStorage")
        if (notes.length > 0) {
            console.log("notes.lenth > 0: " + notes.length)
            console.log(notes)
            const notesStr = JSON.stringify(notes)
            localStorage.setItem('NotesList', notesStr)
        }
        else
            console.log("notes.lenth == 0")
    }

    function loadLocalStorage() {
        console.log("loadLocalStorage")
        const localNotes = localStorage.getItem('NotesList')
        console.log("localNotes= " + localNotes)
        const localNotesArray = JSON.parse(localNotes)
        console.log("localNotesArray length= " + localNotesArray.length)
        console.log(localNotesArray[0])
        return localNotesArray
    }

    useEffect(() => {
        console.log("useEffect fired")
        saveLocalStorage()
    }, [notes])

    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {
        setNotes(oldNotes => oldNotes.map(oldNote => {
            return oldNote.id === currentNoteId
                ? { ...oldNote, body: text }
                : oldNote
        }))
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
