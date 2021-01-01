import React, { useState } from "react";
import { useFetch } from "./hooks";
import './App.css';
import { useCookies } from 'react-cookie';
import axios from 'axios'
import config from './config';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SearchOverlay from "./utils/SearchOverlay";

const url = `${config.domains.api}`;
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "#d7b73f" : "lightgrey",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "black" : "grey",
    padding: grid,
    width: 250
});

function MenuList({items}) {
    const [cookies] = useCookies(['serverless']);
    axios.defaults.headers.common['Authorization'] = `Bearer ${cookies?.serverless?.userToken}`;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    const [modalVisible, setModalVisible] = useState(false);
    const [itemToUpdate, setItemToUpdate] = useState();
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
        });
        return result;
    };
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
    
        items = reorder(
            items,
            result.source.index,
            result.destination.index
        );
    }
    const onSelectForUpdate = async (item) => {
        setItemToUpdate(item);
    }
    const showDescription = (t) => {
        if (t === 'beer' || t === 'cider' || t === 'wine' || t === 'tallboy') {
            return true;
        } else {
            return false;
        }
    }
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
                                    onSelectForUpdate(item).then(() => setModalVisible(true))
                                }}
                            >
                                <span className={'reorder-name'}>{item.name}</span>
                                {showDescription(item.type) ? <div>{item.description}</div> : <div></div>}
                            </div>
                        )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                    </div>
                )}
                </Droppable>
            </DragDropContext>
            <SearchOverlay
                modalVisible={modalVisible}
                item={itemToUpdate}
                setModalVisible={setModalVisible}
            />
        </div>
    );
}

function Admin() {
    let [data, loading] = useFetch(`${url}/items`);
    const [cookies] = useCookies(['serverless']);
    const [modalVisible, setModalVisible] = useState();
    const itemToAdd = {name: "", description: "", type: "draft", price: 0, order: 0 };
    axios.defaults.headers.common['Authorization'] = `Bearer ${cookies?.serverless?.userToken}`;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    const addNewItem = () => {
        setModalVisible(true);
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
            <SearchOverlay
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                item={itemToAdd}
            />
        </>
    );
}

export default Admin;
