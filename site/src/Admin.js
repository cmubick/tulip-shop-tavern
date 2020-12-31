import React from 'react';
import { useFetch } from "./hooks";
import './App.css';
import { Controller, useForm } from "react-hook-form";
import { useCookies } from 'react-cookie';
import axios from 'axios'

function MenuList({items}) {
    const { control, handleSubmit } = useForm();
    const [cookies] = useCookies(['serverless']);
    axios.defaults.headers.common['Authorization'] = `Bearer ${cookies?.serverless?.userToken}`;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
                    
    return (
        <>
            <div>
                <span className={"header"}>Name</span>
                <span className={"header"}>Description</span>
                <span className={"header"}>Price</span>
                <span className={"header"}>Order</span>
                <span className={"header"}></span>
                <span className={"header"}></span>
            </div>
            {
                items.map((item, index) => {
                    const onRemove = (data) => {
                        console.log("remove", data);
                        const apiUrl = 'https://giner2vf60.execute-api.us-east-1.amazonaws.com/items/remove';
                        axios.post(apiUrl, data).then((response) => {
                            console.log("remove response", response);
                            window.location.replace('/admin');
                        });
                    };
                    const onSubmit = (d) => {
                        console.log("update", d);
                        const apiUrl = 'https://giner2vf60.execute-api.us-east-1.amazonaws.com/items/update';
                        axios.post(apiUrl, d).then((response) => {
                            console.log("update response", response);
                            window.location.replace('/admin');
                        });
                    };
                    let editableItem = {
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        order: item.order,
                        active: item.active,
                        type: item.type
                    }
                    return (
                        <form key={item.id} onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                as={<input />}
                                name={`name`}
                                defaultValue={editableItem.name ? editableItem.name : ''}
                                control={control}
                            />
                            <Controller
                                as={<input />}
                                name={`description`}
                                defaultValue={editableItem.description ? editableItem.description : ''}
                                control={control}
                            />
                            <Controller
                                as={<input />}
                                name={`price`}
                                defaultValue={editableItem.price ? editableItem.price : ''}
                                control={control}
                                type={'number'}
                            />
                            <Controller
                                as={<input />}
                                name={`order`}
                                defaultValue={editableItem.order ? editableItem.order : ''}
                                control={control}
                                type={'number'}
                            />
                            <Controller
                                as={<input />}
                                name={`id`}
                                defaultValue={editableItem.id ? editableItem.id : ''}
                                control={control}
                                className="data-only-element"
                            />
                            <Controller
                                as={<input />}
                                name={`type`}
                                defaultValue={editableItem.type ? editableItem.type : ''}
                                control={control}
                                className="data-only-element"
                            />
                            <button type='submit' className={"tst-button"}>update</button>
                            <button onClick={() => onRemove(editableItem)} className={"tst-button"} type='button'>remove</button>
                        </form>
                    )
                })
            }
        </>
    );
}

function Admin() {
    let [data, loading] = useFetch("https://giner2vf60.execute-api.us-east-1.amazonaws.com/items");
    const { control, handleSubmit } = useForm();
    const [cookies] = useCookies(['serverless']);
    let newItem = {name: "", description: "", price: 0, order: 0, active: 1, type: "draft"};
    axios.defaults.headers.common['Authorization'] = `Bearer ${cookies?.serverless?.userToken}`;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    const onSubmit = (d, e) => {
        console.log("submit", d, e);
        const apiUrl = 'https://giner2vf60.execute-api.us-east-1.amazonaws.com/items/create';
        axios.post(apiUrl, d.newItem).then((response) => {
            console.log("create response", response);
            window.location.replace('/admin');
        });
    }
    const onError = (errors, e) => console.log("error", errors, e);
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
                                    <div className={'menu_line'}/>
                                    <div className={'menu_sub_section_header menu_callout_section_header_text'}>
                                        New Item
                                    </div>
                                    <div className={'menu_line'}/>
                                </div>
                                <div>
                                    <div>
                                        <span className={"header"}>Name</span>
                                        <span className={"header"}>Description</span>
                                        <span className={"header"}>Price</span>
                                        <span className={"header"}>Order</span>
                                        <span className={"header"}>Type</span>
                                        <span className={"header"}></span>
                                    </div>
                                    <form onSubmit={handleSubmit(onSubmit, onError)}>
                                        <Controller
                                            as={<input />}
                                            name={`newItem.name`}
                                            defaultValue={newItem.name}
                                            control={control}
                                        />
                                        <Controller
                                            as={<input />}
                                            name={`newItem.description`}
                                            defaultValue={newItem.description}
                                            control={control}
                                        />
                                        <Controller
                                            as={<input />}
                                            name={`newItem.price`}
                                            defaultValue={newItem.price}
                                            control={control}
                                            type={'number'}
                                        />
                                        <Controller
                                            as={<input />}
                                            name={`newItem.order`}
                                            defaultValue={newItem.order}
                                            control={control}
                                            type={'number'}
                                        />
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
                                        <button type='submit' className={"tst-button"}>add</button>
                                    </form>
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
        </>
    );
}

export default Admin;
