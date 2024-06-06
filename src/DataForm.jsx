import React, { useEffect, useState } from "react";
import axios from 'axios';

function DataForm() {
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get('https://jornadaldb.netlify.app/.netlify/functions/api/')
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('There was an error fetching data!', error);
                setError('There was an error fetching data');
                setLoading(false);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !age) {
            setError('Name and age are required');
            return;
        }

        const url = editItem
            ? `https://jornadaldb.netlify.app/.netlify/functions/api/${editItem._id}`
            : 'https://jornadaldb.netlify.app/.netlify/functions/api/';
        const method = editItem ? 'put' : 'post';

        axios[method](url, { name, age })
            .then((response) => {
                console.log('API response:', response.data);

                if (editItem) {
                    setData((prevData) =>
                        prevData.map((item) =>
                            item._id === editItem._id ? response.data : item
                        )
                    );
                } else {
                    setData((prevData) => [...prevData, response.data]);
                }
                resetForm();
            })
            .catch((error) => {
                console.error('There was an error saving data:', error);
                setError('There was an error saving data');
            });
    };

    const handleEdit = (_id) => {
        const itemToEdit = data.find((item) => item._id === _id);
        setEditItem(itemToEdit);
        setName(itemToEdit.name);
        setAge(itemToEdit.age);
    };

    const handleDelete = (_id) => {
        axios
            .delete(`https://jornadaldb.netlify.app/.netlify/functions/api/${_id}`)
            .then(() => {
                setData((prevData) => prevData.filter((item) => item._id !== _id));
            })
            .catch((error) => {
                console.error('There was an error deleting data:', error);
                setError('There was an error deleting data');
            });
    };

    const resetForm = () => {
        setName('');
        setAge('');
        setEditItem(null);
        setError(null);
    };

    return (
        <div className="data-form-container">
            <style>{`
                .data-form-container {
                    max-width: 600px;
                    margin: 40px auto;
                    padding: 20px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    background-color: #fff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 20px;
                }
                input {
                    padding: 12px;
                    border: 1px solid #d0d0d0;
                    border-radius: 4px;
                    font-size: 16px;
                    transition: border-color 0.2s;
                }
                input:focus {
                    border-color: #007bff;
                    outline: none;
                }
                button {
                    padding: 12px;
                    border: none;
                    border-radius: 4px;
                    background-color: #007bff;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                button:hover {
                    background-color: #0056b3;
                }
                ul {
                    list-style: none;
                    padding: 0;
                }
                li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    border-bottom: 1px solid #e0e0e0;
                    transition: background-color 0.2s;
                }
                li:hover {
                    background-color: #f9f9f9;
                }
                .button-group {
                    display: flex;
                    gap: 8px;
                }
                .edit-button {
                    background-color: #28a745;
                }
                .edit-button:hover {
                    background-color: #218838;
                }
                .delete-button {
                    background-color: #dc3545;
                }
                .delete-button:hover {
                    background-color: #c82333;
                }
                p {
                    color: #dc3545;
                    font-size: 14px;
                    margin-top: -10px;
                    margin-bottom: 20px;
                }
            `}</style>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Name'
                />
                <input
                    type='text'
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder='Age'
                />
                <button type='submit'>{editItem ? 'Update Data' : 'Add Data'}</button>
            </form>
            {error && <p>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {data.map((item) => (
                        <li key={item._id}>
                            {item.name} - {item.age}
                            <div className="button-group">
                                <button className="edit-button" onClick={() => handleEdit(item._id)}>Edit</button>
                                <button className="delete-button" onClick={() => handleDelete(item._id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DataForm;
