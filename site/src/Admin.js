import React from 'react';
import { useFetch } from "./hooks";
import './App.css';
import { FixedSizeList } from "react-window";
import { Controller, useFieldArray, useForm } from "react-hook-form";

function MenuList({items}) {
    const { control, getValues } = useForm({
      defaultValues: {
        items: items.filter(d => d.active === 1).sort(d => d.order)
      },
      shouldUnregister: false
    });
    const { remove, add } = useFieldArray({ control, name: "items" });

    const formHeight = 48 * items.length + 1;
  
    return (
        <FixedSizeList
            width={700}
            height={formHeight}
            itemSize={48}
            itemCount={items.length}
            itemData={items}
            itemKey={(i) => items[i].id}
        >
        {({ style, index, data }) => {
            const defaultValue =
            getValues()["items"][index]?.foo ?? data[index]?.foo;
    
            return (
            <form style={style}>
                <Controller
                    as={<input />}
                    name={`items[${index}].name`}
                    defaultValue={defaultValue}
                    control={control}
                />
                <Controller
                    as={<input />}
                    name={`items[${index}].description`}
                    defaultValue={defaultValue}
                    control={control}
                />
                <Controller
                    as={<input />}
                    name={`items[${index}].price`}
                    defaultValue={defaultValue}
                    control={control}
                    type={'number'}
                />
                <button onClick={() => remove(index)}>remove</button>
            </form>
            );
        }}
        </FixedSizeList>
    );
}

function Admin() {
    const [data, loading] = useFetch("https://s3-us-west-2.amazonaws.com/tulipshoptavern.com/menu.json");
    const { handleSubmit, watch } = useForm();
    const onSubmit = data => console.log(data);
    return (
        <>
            {loading ? (
                "Loading..."
            ) : (
            <div className={'tulip_black_border'}>
                <div className={'tulip_gold_border'}>
                    <div className={'tulip_content'}>
                        <div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className={'menu_spacer'}/>
                                <div className={'menu_spacer'}/>
                                <div className={'menu'}>
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

                                    <MenuList items={data.filter(d => d.type === "addon")} />

                                    <div className={'menu_spacer'}/>

                                    <div className={'menu_callout_section_header'}>
                                        <div className={'menu_line'}/>
                                        <div className={'menu_sub_section_header menu_callout_section_header_text'}>
                                            SANDWICHES
                                        </div>
                                        <div className={'menu_line'}/>
                                    </div>
                                    <MenuList items={data.filter(d => d.type === "sandwich")} />

                                    <div className={'menu_spacer'}/>
                                    <div className={'menu_spacer'}/>
                                    <div className={'menu_header'}>
                                        SALADS
                                    </div>
                                    <div className={'menu_spacer'}/>
                                    
                                    <MenuList items={data.filter(d => d.type === "salad")} /> 

                                    <div className={'menu_spacer'}/>
                                    <div className={'menu_spacer'}/>
                                    <div className={'menu_header'}>
                                        SIDES
                                    </div>
                                    <div className={'menu_spacer'}/>
                                    
                                    <MenuList items={data.filter(d => d.type === "side")} />

                                    <div className={'menu_sub_section_header'}>
                                        HOUSE-MADE SAUCES:
                                    </div>
                                    <div className={'menu_item_description'}>
                                        
                                    <MenuList items={data.filter(d => d.type === "sauce")} />

                                    </div>

                                    <div className={'menu_spacer'}/>
                                    <div className={'menu_spacer'}/>
                                    <div className={'menu_header'}>
                                        HOUSE COCKTAILS
                                    </div>
                                    <div className={'menu_spacer'}/>
                                    
                                    <MenuList items={data.filter(d => d.type === "house-drink")} />

                                    <div className={'menu_spacer'}/>
                                    <div className={'menu_spacer'}/>
                                    <div className={'menu_header'}>
                                        CLASSIC SUGGESTIONS
                                    </div>
                                    <div className={'menu_spacer'}/>
                                    
                                    <MenuList items={data.filter(d => d.type === "classic-drink")} />

                                    <div className={'menu_spacer'}/>
                                    <div className={'menu_spacer'}/>
                                    <div className={'menu_header'}>
                                        HOT DRINKS
                                    </div>
                                    <div className={'menu_spacer'}/>
                                    
                                    <MenuList items={data.filter(d => d.type === "hot-drink")} />

                                    <div className={'menu_spacer'}/>
                                    <div className={'menu_spacer'}/>
                                    <div className={'menu_header'}>
                                        WINE
                                    </div>
                                    <div className={'menu_spacer'}/>
                                    
                                    <MenuList items={data.filter(d => d.type === "wine")} />

                                    <div className={'menu_spacer'}/>
                                    <div className={'menu_spacer'}/>
                                    <div className={'menu_header'}>
                                        DRAFT LIST
                                    </div>
                                    <div className={'menu_spacer'}/>
                                    
                                    <MenuList items={data.filter(d => d.type === "draft")} />

                                    <div className={'menu_spacer'}/>
                                    <div className={'menu_spacer'}/>
                                    <div className={'menu_header'}>
                                        TALLBOYS
                                    </div>
                                    <div className={'menu_spacer'}/>

                                    <MenuList items={data.filter(d => d.type === "tallboy")} />

                                    <div className={'menu_spacer'}/>
                                    <div className={'menu_spacer'}/>
                                    <div className={'menu_header'}>
                                        CIDER
                                    </div>
                                    <div className={'menu_spacer'}/>
                                    <MenuList items={data.filter(d => d.type === "cider")} />
                                    
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    );
}

export default Admin;
