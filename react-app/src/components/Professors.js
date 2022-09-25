import React, {useState, useEffect, useRef} from 'react'

const API = process.env.REACT_APP_API;

export const Professors = () => {
    const [id, setID] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [salary, setSalary] = useState('');

    const [editing, setEditing] = useState(false);
    const nameInput = useRef(null);

    let [professors, setProfessors] =  useState([])

    const handleSubmit = async (e) =>{
        e.preventDefault();
        //console.log(API)
        console.log(name, lastName, city, address, salary);
        if(!editing){
            const res = await fetch(`${API}/professors`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: name,
                    last_name: lastName,
                    city: city,
                    address: address,
                    salary: salary
                }),
                
            })
            const delta = await res.json();
        }else{
            const res = await fetch(`${API}/professors/${id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: name,
                    last_name: lastName,
                    city: city,
                    address: address,
                    salary: salary
                })
            })
            const delta = await res.json();
            setEditing(false);
            setID('');
        }
        //console.log(res2);
        await getProfessors();
        setName('');
        setLastName('');
        setCity('');
        setAddress('');
        setSalary('');
        nameInput.current.focus();
    }
    const getProfessors = async ()=>{
        const res = await fetch(`${API}/professors`)
        const data = await res.json();
        setProfessors(data);
        console.log(data);
    }
    useEffect(()=>{
        getProfessors();
    },[])

    const deleteProfessor =  async (id) => {
        const userResponse = window.confirm('Estas seguro de Eliminar Este Registro ?')
        if (userResponse == true){
            const res = await fetch(`${API}/professors/${id}`,{
                method: 'DELETE'
            });
            const data = await res.json();
            await getProfessors();
            console.log(data);
        }
        
    }
    const updateProfessor = async (id) => {
        const res = await fetch(`${API}/professors/${id}`);
        const data = await res.json();
        console.log(data);
        setEditing(true);
        let auxId = 0;
        let auxName = '';
        let auxLastName = '';
        let auxCity = '';
        let auxAddress = '';
        let auxSalary = '';
        data.map(data2 => (
        auxId = data2['id'],
        auxName = data2['first_name'],
        auxLastName = data2['last_name'],
        auxCity=data2['city'],
        auxAddress =data2['address'],
        auxSalary = data2['salary']
        )) ;
        setID(auxId);
        setName(auxName);
        setLastName(auxLastName);
        setCity(auxCity);
        setAddress(auxAddress);
        setSalary(auxSalary);
        nameInput.current.focus();
        console.log(name, lastName, city, address, salary);

    }

    return (
        <div className='row'>
            <div className='col-md-4'>
                <form onSubmit={handleSubmit} className="card card-body">
                    <div className='form-group'>
                        <input name='name' type="text" onChange={e => setName(e.target.value)} 
                        value={name}
                        className="form-control"
                        placeholder='Name'
                        ref={nameInput}
                        autoFocus
                        />
                    </div>
                    <div className='form-group'>
                        <input name='last_name' type="text" onChange={e => setLastName(e.target.value)} 
                        value={lastName}
                        className="form-control"
                        placeholder='Last Name'
                        autoFocus
                        />
                    </div>
                    <div className='form-group'>
                        <input name='city' type="text" onChange={e => setCity(e.target.value)} 
                        value={city}
                        className="form-control"
                        placeholder='City'
                        autoFocus
                        />
                    </div>
                    <div className='form-group'>
                        <input name='address' type="text" onChange={e => setAddress(e.target.value)} 
                        value={address}
                        className="form-control"
                        placeholder='Address'
                        autoFocus
                        />
                    </div>
                    <div className='form-group'>
                        <input name='salary' type="text" onChange={e => setSalary(e.target.value)} 
                        value={salary}
                        className="form-control"
                        placeholder='Salary'
                        autoFocus
                        />
                    </div>
                    <button className='btb brt-primary btn-block'>
                        {editing ? 'Editar' : 'Crear'}
                    </button>
                </form>
            </div>
            <div className='col-md-6'>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>
                                ID
                            </th>
                            <th>
                                Nombre
                            </th>
                            <th>
                                Apellido
                            </th>
                            <th>
                                Ciudad
                            </th>
                            <th>
                                Direccion
                            </th>
                            <th>
                                Salario
                            </th>
                            <th>
                                Operations
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        professors.map(professor =>(
                            <tr key ={professor['id']}>
                                <td>{professor['id']}</td>
                                <td>{professor['first_name']}</td>
                                <td>{professor['last_name']}</td>
                                <td>{professor['city']}</td>
                                <td>{professor['address']}</td>
                                <td>{professor['salary']}</td>
                                <td>
                                    <button className='btn btn-secondary btn-sm btn-block'
                                    onClick={(e) =>updateProfessor(professor['id'])}
                                    >
                                        Editar
                                    </button>
                                    <button className='btn btn-danger btn-sm btn-block'
                                    onClick={(e) => deleteProfessor(professor['id'])}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                                
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}