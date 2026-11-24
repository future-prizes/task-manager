import {useState,useRef,useEffect} from "react"

const tags=["Work"
    ,"Personal"
    ,"Money"
    ,"Relationships"
    ,"Events"
    ,"Travel"
    ,"Leisure"
    ,"Shopping"
]

function TagForm({newPostChosen}) {

    const [chosen, setChosen] = useState([])
    const resetter = useRef(newPostChosen)

    function addTag(tag) {
        setChosen((previous) => 
        previous.includes(tag) ?
        previous.filter((item) => item !==tag)
    : [...previous,tag])
    }
    
    useEffect(()=>{
        if (newPostChosen !== resetter.current) {
            resetter.current = newPostChosen
            setChosen([])
        }
    },[newPostChosen])

    return (
        <>
        <label className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
            type="button"
            key={tag}
            className={chosen.includes(tag) ? 
                "inset-shadow-sm inset-shadow-gray-800 py-2 px-4 cursor-pointer flex justify-center items-center bg-gray-400 rounded-sm":
                "py-2 px-4 cursor-pointer flex justify-center items-center bg-sky-100 rounded-sm"}
            onClick={()=>{addTag(tag)}}>
            {tag}
            </button>
          ))}
        </label>
        {chosen.map((tag) => (
            <input key={tag} type="hidden" name="tags" value={tag}></input>
        ))}
        </>
    )
}

export default TagForm