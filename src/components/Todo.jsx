import { useState } from 'react'

const Todo = () => {
     // To handle todo form data
    const [todo, setTodo] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState('Personal');
    const [notes, setNotes] = useState('');

    const [todos, setTodos] = useState([]); // to handle todo list
    const [isEdit, setIsEdit] = useState({ state: false, text: '' }); // to handle edit todo
    const [activeTab, setActiveTab] = useState(0); // to handle tabs
    
    const [searchTerm, setSearchTerm] = useState(''); // handles search term
    const [sortType, setSortType] = useState('date'); // handles sorting term
    
    const [darkMode, setDarkMode] = useState(false); // handles dark mode
    const [ isAccordion, setAccordion] = useState(false); // handles accordion toggle

    // Add Todo or Edit Todo
    const addTodo = (e) => {
        e.preventDefault();
        // Edit 
        if (isEdit?.state) {
            const newTodos = todos.map((item) => item.text === isEdit.text ? { ...item, text: todo, priority: priority, dueDate: dueDate, category: category, notes: notes } : item);
            setTodos(newTodos)
            clearForm()
            setIsEdit({ state: false, text: '' })
        } else {
            // Add
            setTodos(prevState => [...prevState, {
                text: todo,
                status: 'open',
                addedDate: new Date(),
                priority,
                dueDate,
                category,
                notes
            }]);
            clearForm()
        }
        setAccordion(false)
    }

    // To Reset form
    const clearForm = () => {
        setTodo('');
        setPriority('Medium');
        setDueDate('');
        setCategory('Personal');
        setNotes('');
    }

    // Change status of a todo
    const changeStatus = (item) => {
        const newTodos = todos.map((todo) => {
            if (todo.text === item.text) {
                return { ...todo, status: item.status === 'open' ? 'close' : 'open', completedDate: item.status === 'open' ? new Date() : null };
            }
            return todo;
        });
        setTodos(newTodos);
    }

    // Edit Todo
    const editTodo = (item) => {
        setIsEdit({ state: true, text: item.text })
        setTodo(item.text)
        setCategory(item.category)
        setDueDate(item.dueDate)
        setNotes(item.notes)
        setPriority(item.priority)
        setAccordion(true)
    }

    // Delete Todo
    const deleteTodo = (item) => {
        const newTodos = todos.filter((todo) => todo.text != item.text);
        setTodos(newTodos)
    }

    // Filter todos based on search
    const filteredTodos = todos.filter(todo => todo.text.toLowerCase().includes(searchTerm.toLowerCase()));

    // Sort todos based on selected sorting
    const sortedTodos = [...filteredTodos].sort((a, b) => {
        if (sortType === 'date') return new Date(b.addedDate) - new Date(a.addedDate);
        if (sortType === 'due') return new Date(a.dueDate) - new Date(b.dueDate);
        if (sortType === 'priority') return a.priority.localeCompare(b.priority);
        return 0;
    });

    return (
        <div className={darkMode ? 'bg-dark text-white' : 'bg-light text-dark'} style={{ minHeight: '100vh', padding: '20px' }}>

            {/* Dark Mode Button */}
            <button onClick={() => setDarkMode(!darkMode)} className="btn btn-secondary mb-3">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            {/* Accordion for add todo form */}
            <div className="accordion" id="accordionExample">

                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                        <button onClick={() => setAccordion(!isAccordion)} className="accordion-button p-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                            <h3>{isEdit?.state ? 'Edit' : 'Add'} Todo</h3>
                        </button>
                    </h2>
                    { isAccordion && 
                        <div id="collapseOne" className="accordion-collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <form onSubmit={addTodo}>
                                <input value={todo} type="text" name="todo" className="form-control mt-2" placeholder='Enter todo' onChange={(e) => setTodo(e.target.value)} />
                                <div className="d-flex">
                                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="form-control mt-2">
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="form-control mt-2 mx-2" />
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-control mt-2">
                                        <option value="Work">Work</option>
                                        <option value="Personal">Personal</option>
                                    </select>
                                </div>
                                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="form-control mt-2" placeholder="Add notes"></textarea>
                                <button type='submit' className='btn btn-warning mt-3'>{isEdit?.state ? 'Update' : 'Add'}</button>
                            </form>
                        </div>
                    </div> 
                    }
                </div>
            </div>

            {/* Tab Buttons */}
            <div className="btn-group mt-2" role="group">
                <button type="button" className="btn btn-danger" onClick={() => setActiveTab(0)}>On-going Tasks</button>
                <button type="button" className="btn btn-success" onClick={() => setActiveTab(1)}>Completed Tasks</button>
            </div>

            {/* Todo List Filters & Sorting */}
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-control mt-2" placeholder="Search tasks" />
            <select value={sortType} onChange={(e) => setSortType(e.target.value)} className="form-control mt-2">
                <option value="date">Date Added</option>
                <option value="due">Due Date</option>
                <option value="priority">Priority</option>
            </select>

            {/* On going Todo List */}
            {activeTab === 0 &&
                <ul className="list-group mt-2">
                    {sortedTodos.filter(todo => todo.status !== 'close').map((item, i) =>
                        <li className={`list-group-item text-white ${item.status === 'open' ? 'bg-danger' : 'bg-success'}`} key={i}>
                            <div className="d-flex justify-content-between">
                                <div style={{ fontSize: '12px', letterSpacing: '0.05rem' }}>{item?.addedDate?.toLocaleString()}</div>
                                <div style={{ fontSize: '12px', letterSpacing: '0.05rem' }}>Due: {item.dueDate}</div>
                                <div style={{ fontSize: '12px', letterSpacing: '0.05rem' }}>Priority: {item.priority}</div>
                                <div style={{ fontSize: '12px', letterSpacing: '0.05rem' }}>Category: {item.category}</div>
                            </div>
                            <div className="d-flex justify-content-center align-items-center">
                                <div className='fs-4'>{item.text}</div>
                                <div className="d-flex ms-auto">
                                    <div onClick={() => deleteTodo(item)} style={{ width: '30px', height: '30px', cursor: 'pointer' }} className='mx-1 bg-warning rounded-circle d-flex justify-content-center align-items-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                        </svg>
                                    </div>
                                    <div onClick={() => editTodo(item)} style={{ width: '30px', height: '30px', cursor: 'pointer' }} className='mx-1 bg-primary rounded-circle d-flex justify-content-center align-items-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                                        </svg>
                                    </div>
                                    <div onClick={() => changeStatus(item)} style={{ width: '30px', height: '30px', cursor: 'pointer' }} className='mx-1 bg-success rounded-circle d-flex justify-content-center align-items-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16">
                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div style={{ fontSize: '12px', letterSpacing: '0.05rem' }}>Notes: {item.notes}</div>
                        </li>
                    )}
                </ul>
            }

            {/* Completed Todo List */}
            {activeTab === 1 &&
                <ul className="list-group mt-2">
                    {sortedTodos.filter(todo => todo.status !== 'open').map((item, i) =>
                        <li className={`list-group-item text-white ${item.status === 'open' ? 'bg-danger' : 'bg-success'}`} key={i}>
                            <div className="d-flex justify-content-between">
                                <div style={{ fontSize: '12px', letterSpacing: '0.05rem' }}>{item?.addedDate?.toLocaleString()}</div>
                                <div style={{ fontSize: '12px', letterSpacing: '0.05rem' }}>Due: {item.dueDate}</div>
                                <div style={{ fontSize: '12px', letterSpacing: '0.05rem' }}>Priority: {item.priority}</div>
                                <div style={{ fontSize: '12px', letterSpacing: '0.05rem' }}>Category: {item.category}</div>
                            </div>
                            <div className="d-flex justify-content-center align-items-center">
                                <div className='fs-4'>{item.text}</div>
                                <div onClick={() => changeStatus(item)} style={{ width: '30px', height: '30px', cursor: 'pointer' }} className='ms-auto bg-danger rounded-circle d-flex justify-content-center align-items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                    </svg>
                                </div>
                            </div>
                            <div style={{ fontSize: '12px' }}>Notes: {item.notes}</div>
                        </li>
                    )}
                </ul>
            }
        </div>
    )
}

export default Todo