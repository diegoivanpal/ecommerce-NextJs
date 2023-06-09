import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({swal}) {
    const [editedCategory, setEditedCategory] = useState(null)
    const [name, setName] = useState('')
    const [categories, setCategories] = useState([])
    const [properties, setProperties] = useState ([])
    const [parentCategory, setParentCategory] =useState('')
    useEffect(() => {
        fetchCategories()
    },[])

    function fetchCategories() {
        axios.get('/api/categories').then(result => {
            setCategories(result.data)
        })

    }

    async function saveCategory(ev) {
        ev.preventDefault()
        const data = {
            name,
            parentCategory,
            properties: properties.map(p =>({
                name:p.name,
                values:p.values.split(','),}))
        }
        if(editedCategory){
            data._id = editedCategory._id
            await axios.put('/api/categories', data)
            setEditedCategory(null)
        } else {
            await axios.post('/api/categories', data)
        }        
        setName('')
        setParentCategory('')
        setProperties([])
        fetchCategories()
    }

     function editCategory(category) {
        setEditedCategory(category)
        setName(category.name)
        setParentCategory(category.parent?._id)
        setProperties(category.properties.map(({name,values}) => ({
            name,
            values:values.join(',')
        }) ))
     }

     function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to Delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButton: true,            
           
        }).then(async result=> {
            if(result.isConfirmed) {
                const {_id } = category
                await axios.delete('/api/categories?_id='+_id)
                fetchCategories()
            }

        }).catch(error => {

        })
     }  
     function addProperty() {
        setProperties(prev => {
            return [...prev, {name:'',values:''}]
        })
     }  
     function handlePropertyNameChange(index, property, newName) {
                setProperties(prev => {
                    const properties = [...prev]
                    properties[index].name = newName
                    return properties
                })
     }
     function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev]
            properties[index].values = newValues
            return properties
        })

}
function removeProperty(indexToRemove) {
    setProperties(prev => {
        return [...prev].filter((p,pIndex) => {
            return pIndex !== indexToRemove
        })            
    })
}
    return(
        <Layout>
            <h1>Categories</h1>
            <label> {editedCategory ? `Edit Category ${editedCategory.name}`: 'Create New Category' } </label>
            <form onSubmit={saveCategory} >
                <div className="flex gap-1">
                <input value={name} onChange={ev => setName(ev.target.value)} type="text" placeholder={"Category Namer"} ></input>
                <select  
                        onChange={ev => setParentCategory(ev.target.value)}
                        value={parentCategory}>
                    <option value="">No parent category</option>
                    {categories.length >0 && categories.map(
                        category =>( 
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ) )}
                </select>

                </div>
                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button type="button"
                     className="btn-default text-sm"
                     onClick={addProperty}
                     >Add new property</button>
                     {properties.length > 0 && properties.map((property, index) => (
                        <div key={index} className="flex gap-1 mb-2">
                            <input type='text'
                                   className="mb-0"
                                   value={property.name}
                                   onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                                   placeholder="property name (example: color)"/>
                            <input type='text'
                                   className="mb-0"
                                   value={property.values}
                                   onChange={ev => handlePropertyValuesChange(index, properties, ev.target.value)}
                                   placeholder="values coma separated"/>
                            <button className="btn-red" type="button" onClick={() => removeProperty(index)}>
                                Remove
                            </button>
                        </div>
                        
                     ))}
                </div>
                <div className="flex gap-1">
                {editCategory && (
                                    <button 
                                        type="button"
                                        className="btn-primary py-1"
                                        onClick={() => {setEditedCategory(null)
                                            setName('')
                                        setParentCategory('')
                                        setProperties([])
                                    }
                                }
                                        
                                    >Cancel</button>   

                )}

                <button type="submit"
                 className="btn-primary py-1"
                 >Save</button>   

                </div>
           
            </form>
            {!editedCategory && (
                            <table className="basic mt-4">
                            <thead>
                                <tr>
                                    <td>Category Name</td>
                                    <td>Parent Category</td>
                                    <td></td>
                                </tr>
                                
                            </thead>
                            <tbody>
                                {categories.length >0 && categories.map(
                                    category =>( 
                                        <tr key={category._id}>
                                            <td>{category.name}</td>
                                            <td>{category?.parent?.name}</td>                                
                                            <td>
                                                <button 
                                                onClick={() => editCategory(category)} 
                                                className="btn-default"
                                                >Edit</button>                                
                                                <button 
                                                onClick={()=>deleteCategory(category)}
                                                className="btn-red"
                                                >Delete</button>
                                            </td>                                
                                        </tr>
                                    ) )}
                            </tbody>
                        </table>

            )}

            
        </Layout>
    )

}

export default withSwal(({swal}, ref)=> 
    (<Categories swal={swal}/>)

)