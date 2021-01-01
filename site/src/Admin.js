import React, { useState } from "react";
import Overlay from "react-overlay-component";
import { useFetch } from "./hooks";
import './App.css';
import { Controller, useForm } from "react-hook-form";
import { useCookies } from 'react-cookie';
import axios from 'axios'
import config from './config';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const url = `${config.domains.api}`;
const grid = 8;
const types = [
    { value: "draft", label: "Draft" },
    { value: "tallboy", label: "Tallboy" },
    { value: "cider", label: "Cider" },
    { value: "wine", label: "Wine" },
    { value: "sandwich", label: "Sandwich" },
    { value: "addon", label: "Add-On" },
    { value: "side", label: "Side" },
    { value: "salad", label: "Salad" },
    { value: "sauce", label: "Sauce" },
    { value: "house-drink", label: "House Drink" },
    { value: "classic-drink", label: "Classic Drink" },
    { value: "hot-drink", label: "Hot Drink" }
  ];

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "#d7b73f" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "black" : "lightgrey",
    padding: grid,
    width: 250
});

function MenuList({items}) {
    const { control, handleSubmit } = useForm();
    const [cookies] = useCookies(['serverless']);
    axios.defaults.headers.common['Authorization'] = `Bearer ${cookies?.serverless?.userToken}`;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    const [expand, setExpand] = useState(false);
    const [itemToUpdate, setItemToUpdate] = useState({});
    const [isOpen, setOverlay] = useState(false);
    const closeOverlay = () => setOverlay(false);
    const configs = {};
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        result.forEach((item, index) => {
            item.order = index;
        });
        console.log(result);
        const apiUrl = `${url}/items/update/many`;
        axios.post(apiUrl, {data: result}).then((response) => {
            console.log("reorder response", response);
            window.location.replace('/admin');
        });
        return result;
    };
    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
    
        items = reorder(
            items,
            result.source.index,
            result.destination.index
        );
    
        // setState({
        //     items
        // });
    }
    const onSelectForUpdate = (item) => {
        console.log(item);
        setItemToUpdate(item);
        console.log(itemToUpdate);
        setOverlay(true);
    }
    const onSubmit = (d, e) => {
        console.log("submit", d, e);
        const apiUrl = `${url}/items/update`;
        axios.post(apiUrl, d).then((response) => {
            console.log("create response", response);
            window.location.replace('/admin');
        });
    }
    const onError = (errors, e) => console.log("error", errors, e);
    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                    className={'tst-droppable'}
                    >
                    {items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                )}
                                onClick={() => {
                                    onSelectForUpdate(item)
                                }}
                            >
                                {item.name}
                            </div>
                        )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                    </div>
                )}
                </Droppable>
            </DragDropContext>
            <Overlay configs={configs} isOpen={isOpen} closeOverlay={closeOverlay}>
                <div className={'update-form-wrapper'}>
                    <form>
                        <Controller
                            as={<input />}
                            name={`itemToUpdate.name`}
                            defaultValue={itemToUpdate?.name}
                            control={control}
                        />
                        <br/>
                        <Controller
                            as={<input />}
                            name={`itemToUpdate.description`}
                            defaultValue={itemToUpdate?.description}
                            control={control}
                        />
                        <br/>
                        <Controller
                            as={<input />}
                            name={`itemToUpdate.price`}
                            defaultValue={itemToUpdate?.price}
                            control={control}
                            type={'number'}
                        />
                        <br/>
                        <Controller
                            as={<input />}
                            name={`itemToUpdate.order`}
                            defaultValue={itemToUpdate?.order}
                            control={control}
                            type={'number'}
                        />
                        <br/>
                        <Controller
                            as={
                                <select style={{ width: 200 }} className={"dropdown"}>
                                    {types.map(d => {
                                        return (
                                        <option key={d.value} value={d.value}>
                                            {d.label}
                                        </option>
                                        );
                                    })}
                                </select>
                            }
                            placeholder="Type"
                            name="itemToUpdate.type"
                            defaultValue={itemToUpdate?.type}
                            options={types}
                            onChange={([e]) => {
                                itemToUpdate.type = e;
                                return { value: e };
                            }}
                            control={control}
                        />
                        <br/>
                        <Controller
                            as={<input />}
                            name={`active`}
                            defaultValue={1}
                            control={control}
                            type={'number'}
                            className="data-only-element"
                        />
                        <br/>
                        <button type='button' onClick={() => onSubmit(itemToUpdate)} className={"tst-button"}>update</button>
                    </form>  
                </div>
            </Overlay>
        </div>
    );
}

function Admin() {
    let [data, loading] = useFetch(`${url}/items`);
    const { control, handleSubmit } = useForm();
    const [cookies] = useCookies(['serverless']);
    const [isAddOpen, setAddOverlay] = useState(false);
    const closeAddOverlay = () => setAddOverlay(false);
    const configs = {};
    let newItem = {"name": "", "description": "", "price": 0, "order": 0, "active": 1, "type": "draft"};
    axios.defaults.headers.common['Authorization'] = `Bearer ${cookies?.serverless?.userToken}`;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    const onSubmit = (d, e) => {
        console.log("submit", d, e);
        const apiUrl = `${url}/items/create`;
        axios.post(apiUrl, d.newItem).then((response) => {
            console.log("create response", response);
            window.location.replace('/admin');
        });
    }
    const onError = (errors, e) => console.log("error", errors, e);
    const addNewItem = () => {
        setAddOverlay(true);
    }
    if (!cookies?.serverless?.userToken) {
        window.location.replace('/login');
    }
    return (
        <>
            {loading ? (
                "Loading..."
            ) : (
            <div className={'tulip_black_border'}>
                <div className={'tulip_gold_border'}>
                    <div className={'tulip_content'}>
                        <div>
                            <div className={'menu_spacer'}/>
                            <div className={'menu_spacer'}/>
                            <div className={'menu'}>
                                <div className={'menu_callout_section_header'}>
                                    <button type='submit' className={"tst-button"} onClick={() => addNewItem()}>Add New Item</button>
                                </div>
                                <div className={'menu_spacer'}/>
                                <div className={'menu_spacer'}/>
                                <div className={'menu_header'}>
                                    SANDWICHES
                                </div>
                                <div className={'menu_subheader'}>
                                    (Served a la carte)
                                </div>
                                <div className={'menu_callout_section_header'}>
                                    <div className={'menu_line'}/>
                                    <div className={'menu_sub_section_header menu_callout_section_header_text'}>
                                        ADD-ONS
                                    </div>
                                    <div className={'menu_line'}/>
                                </div>

                                <MenuList items={data.returnItems.filter(d => d.type === "addon").sort((x, y) => x.order - y.order)} />

                                <div className={'menu_spacer'}/>

                                <div className={'menu_callout_section_header'}>
                                    <div className={'menu_line'}/>
                                    <div className={'menu_sub_section_header menu_callout_section_header_text'}>
                                        SANDWICHES
                                    </div>
                                    <div className={'menu_line'}/>
                                </div>
                                <MenuList items={data.returnItems.filter(d => d.type === "sandwich").sort((x, y) => x.order - y.order)} />

                                <div className={'menu_spacer'}/>
                                <div className={'menu_spacer'}/>
                                <div className={'menu_header'}>
                                    SALADS
                                </div>
                                <div className={'menu_spacer'}/>
                                
                                <MenuList items={data.returnItems.filter(d => d.type === "salad").sort((x, y) => x.order - y.order)} /> 

                                <div className={'menu_spacer'}/>
                                <div className={'menu_spacer'}/>
                                <div className={'menu_header'}>
                                    SIDES
                                </div>
                                <div className={'menu_spacer'}/>
                                
                                <MenuList items={data.returnItems.filter(d => d.type === "side").sort((x, y) => x.order - y.order)} />

                                <div className={'menu_sub_section_header'}>
                                    HOUSE-MADE SAUCES:
                                </div>
                                <div className={'menu_item_description'}>
                                    
                                <MenuList items={data.returnItems.filter(d => d.type === "sauce").sort((x, y) => x.order - y.order)} />

                                </div>

                                <div className={'menu_spacer'}/>
                                <div className={'menu_spacer'}/>
                                <div className={'menu_header'}>
                                    HOUSE COCKTAILS
                                </div>
                                <div className={'menu_spacer'}/>
                                
                                <MenuList items={data.returnItems.filter(d => d.type === "house-drink").sort((x, y) => x.order - y.order)} />

                                <div className={'menu_spacer'}/>
                                <div className={'menu_spacer'}/>
                                <div className={'menu_header'}>
                                    CLASSIC SUGGESTIONS
                                </div>
                                <div className={'menu_spacer'}/>
                                
                                <MenuList items={data.returnItems.filter(d => d.type === "classic-drink").sort((x, y) => x.order - y.order)} />

                                <div className={'menu_spacer'}/>
                                <div className={'menu_spacer'}/>
                                <div className={'menu_header'}>
                                    HOT DRINKS
                                </div>
                                <div className={'menu_spacer'}/>
                                
                                <MenuList items={data.returnItems.filter(d => d.type === "hot-drink").sort((x, y) => x.order - y.order)} />

                                <div className={'menu_spacer'}/>
                                <div className={'menu_spacer'}/>
                                <div className={'menu_header'}>
                                    WINE
                                </div>
                                <div className={'menu_spacer'}/>
                                
                                <MenuList items={data.returnItems.filter(d => d.type === "wine").sort((x, y) => x.order - y.order)} />

                                <div className={'menu_spacer'}/>
                                <div className={'menu_spacer'}/>
                                <div className={'menu_header'}>
                                    DRAFT LIST
                                </div>
                                <div className={'menu_spacer'}/>
                                
                                <MenuList items={data.returnItems.filter(d => d.type === "draft").sort((x, y) => x.order - y.order)} />

                                <div className={'menu_spacer'}/>
                                <div className={'menu_spacer'}/>
                                <div className={'menu_header'}>
                                    TALLBOYS
                                </div>
                                <div className={'menu_spacer'}/>

                                <MenuList items={data.returnItems.filter(d => d.type === "tallboy").sort((x, y) => x.order - y.order)} />

                                <div className={'menu_spacer'}/>
                                <div className={'menu_spacer'}/>
                                <div className={'menu_header'}>
                                    CIDER
                                </div>
                                <div className={'menu_spacer'}/>
                                <MenuList items={data.returnItems.filter(d => d.type === "cider").sort((x, y) => x.order - y.order)} />
                                
                                <div className={'menu_spacer'}/>
                                <div className={'menu_spacer'}/>
                                <div className={'menu_item_description'}>
                                    <span>*Consuming raw or undercooked meats, poultry, shellfish or eggs may increase your risk of food-borne illness.</span>
                                </div>
                                <div className={'menu_spacer'}/>
                                <div className={'menu_spacer'}/>
                                <div className={'menu_spacer'}/>
                                <div className={'menu_spacer'}/>
                                <div className={'menu_spacer'}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
            <Overlay configs={configs} isOpen={isAddOpen} closeOverlay={closeAddOverlay}>
                <div className={'update-form-wrapper'}>
                    <form onSubmit={handleSubmit(onSubmit, onError)}>
                        <Controller
                            as={<input />}
                            name={`newItem.name`}
                            placeholder={'Title'}
                            defaultValue={newItem.name}
                            control={control}
                        />
                        <br/>
                        <Controller
                            as={<input />}
                            name={`newItem.description`}
                            placeholder={'Description'}
                            defaultValue={newItem.description}
                            control={control}
                        />
                        <br/>
                        <Controller
                            as={<input />}
                            name={`newItem.price`}
                            defaultValue={newItem.price}
                            control={control}
                            type={'number'}
                        />
                        <br/>
                        <Controller
                            as={<input />}
                            name={`newItem.order`}
                            defaultValue={newItem.order}
                            control={control}
                            type={'number'}
                        />
                        <br/>
                        <Controller
                            as={
                                <select style={{ width: 200 }} className={"dropdown"}>
                                    {types.map(d => {
                                        return (
                                        <option key={d.value} value={d.value}>
                                            {d.label}
                                        </option>
                                        );
                                    })}
                                </select>
                            }
                            placeholder="Type"
                            name="newItem.type"
                            defaultValue={newItem.type}
                            options={types}
                            onChange={([e]) => {
                                newItem.type = e;
                                return { value: e };
                            }}
                            control={control}
                        />
                        <br/>
                        <Controller
                            as={<input />}
                            name={`active`}
                            defaultValue={1}
                            control={control}
                            className="data-only-element"
                        />
                        <button type='submit' className={"tst-button"}>add</button>
                    </form>  
                </div>
            </Overlay>
        </>
    );
}

export default Admin;
