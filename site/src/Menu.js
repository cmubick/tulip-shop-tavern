import React from "react";
import { useFetch } from "./hooks";
import tulipShopTavernLogo from './assets/tulipshoptavern_logo.svg';
import instagram from './assets/instagram-white-icon.svg';
import mail from './assets/email-white-icon.svg';

function Menu() {
    const [data, loading] = useFetch("https://giner2vf60.execute-api.us-east-1.amazonaws.com/items");
    const addons = data?.returnItems.filter(d => d.type === "addon" && d.active === 1).sort(d => d.order);
    return (
        <>
            {loading ? (
                "Loading..."
            ) : (
        <div className={'tulip_black_border'}>
            <div className={'tulip_gold_border'}>
                <div className={'tulip_content'}>
                    <div className={'tulip_logo_wrapper'}>
                        <img src={tulipShopTavernLogo} alt={'Tulip Shop Tavern'} className={'tulip_logo'}/>
                    </div>
                    <div className={'call_out'}>
                        <span>Now offering cocktails to-go. Please ask your server or bartender for details.</span>
                    </div>
                    <div className={'media_links'}>
                        <span>Open noon-10pm everyday</span>
                        <br/>
                        <span>Please call ahead for to-go orders</span>
                        <br/>
                        <span>20% gratuity will be added to all 3rd party delivery orders.</span>
                        <br/>
                    </div>
                    <div className={'address_wrapper'}>
                        <div className={'address_line'}>825 N Killingsworth St</div>
                        <div className={'address_line'}>Portland, OR 97217</div>
                        <div className={'address_line'}>
                            <a className={'phone_number'} href="tel:+15032068483">503.206.8483</a>
                        </div>
                    </div>
                    <div className={'menu_spacer'}/>
                    <div className={'social_media_links_wrapper'}>
                        <div className={'social_media_item'}>
                            <a href="https://www.instagram.com/tulipshoptavern/" target="_blank"
                               rel="noopener noreferrer">
                                <img
                                    src={instagram}
                                    alt="Instagram"
                                    className={'social_media_icon'}
                                />
                            </a>
                        </div>
                        <div className={'social_media_item'}>
                            <a href="mailto:info@tulipshoptavern.com?subject=Mail from Our Website" target="_blank"
                               rel="noopener noreferrer">
                                <img
                                    src={mail}
                                    alt="Email"
                                    className={'social_media_icon'}
                                />
                            </a>
                        </div>
                    </div>
                    <div className={'menu_spacer'}/>
                    <div className={'media_links'}>
                        <a href="https://www.wweek.com/bars/2019/06/25/try-as-old-portland-might-theres-little-to-complain-about-at-tulip-shop-tavern/"
                           target="_blank" rel="noopener noreferrer">
                            Tulip Shop Tavern in Willamette Week
                        </a>
                        <br/>
                        <a href="https://pdx.eater.com/2019/3/21/18275814/tulip-shop-tavern-killingsworth"
                           target="_blank" rel="noopener noreferrer">
                            Tulip Shop Tavern on Eater PDX
                        </a>
                    </div>
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
                        <div className={'menu_item_description'}>
                            {
                                addons.sort((x, y) => x.order - y.order).map((data, index) => {
                                    return (
                                        <span key={data.id}>
                                            { data.name} <span className={'menu_item_bold'}>${data.price} </span>
                                            <span hidden={addons.length < (index + 2)}> | </span>
                                        </span>
                                    )
                                })
                            }
                        </div>

                        <div className={'menu_spacer'}/>

                        {
                            data.returnItems.filter(d => d.active === 1 && d.type === "sandwich").sort((x, y) => x.order - y.order).map((data) => {
                                return (
                                    <div key={data.id}>
                                        <div className={'menu_sub_section_header'}>
                                            {data.name} ${data.price}
                                        </div>
                                        <div className={'menu_item_description'}>
                                            {data.description}
                                        </div>
                                    </div>
                                )
                            })
                        }

                        <div className={'menu_spacer'}/>
                        <div className={'menu_spacer'}/>
                        <div className={'menu_header'}>
                            SALADS
                        </div>
                        <div className={'menu_spacer'}/>

                        {
                            data.returnItems.filter(d => d.active === 1 && d.type === "salad").sort((x, y) => x.order - y.order).map((data) => {
                                return (
                                    <div key={data.id}>
                                        <div className={'menu_sub_section_header'}>
                                            {data.name} ${data.price}
                                        </div>
                                        <div className={'menu_item_description'}>
                                            {data.description}
                                        </div>
                                    </div>
                                )
                            })
                        }

                        <div className={'menu_spacer'}/>
                        <div className={'menu_spacer'}/>
                        <div className={'menu_header'}>
                            SIDES
                        </div>
                        <div className={'menu_spacer'}/>
                        
                        {
                            data.returnItems.filter(d => d.active === 1 && d.type === "side").sort((x, y) => x.order - y.order).map((data) => {
                                return (
                                    <div key={data.id}>
                                        <div className={'menu_sub_section_header'}>
                                            {data.name} ${data.price}
                                        </div>
                                        <div className={'menu_item_description'}>
                                            {data.description}
                                        </div>
                                    </div>
                                )
                            })
                        }

                        <div className={'menu_sub_section_header'}>
                            HOUSE-MADE SAUCES:
                        </div>
                        <div className={'menu_item_description'}>
                            (First sauce free, each additional sauce $.50)<br/>

                            {
                                data.returnItems.filter(d => d.active === 1 && d.type === "sauce").sort((x, y) => x.order - y.order).map((data) => {
                                    return (
                                        <div key={data.id}>
                                            <div className={'sauces'}>
                                                {data.name}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className={'menu_spacer'}/>
                        <div className={'menu_spacer'}/>
                        <div className={'menu_header'}>
                            HOUSE COCKTAILS
                        </div>
                        <div className={'menu_spacer'}/>
                        {
                            data.returnItems.filter(d => d.active === 1 && d.type === "house-drink").sort((x, y) => x.order - y.order).map((data) => {
                                return (
                                    <div key={data.id}>
                                        <div className={'menu_sub_section_header'}>
                                            {data.name} ${data.price}
                                        </div>
                                        <div className={'menu_item_description'}>
                                            {data.description}
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <div className={'menu_spacer'}/>
                        <div className={'menu_spacer'}/>
                        <div className={'menu_header'}>
                            CLASSIC SUGGESTIONS
                        </div>
                        <div className={'menu_spacer'}/>
                        {
                            data.returnItems.filter(d => d.active === 1 && d.type === "classic-drink").sort((x, y) => x.order - y.order).map((data) => {
                                return (
                                    <div key={data.id}>
                                        <div className={'menu_sub_section_header'}>
                                            {data.name} ${data.price}
                                        </div>
                                        <div className={'menu_item_description'}>
                                            {data.description}
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <div className={'menu_spacer'}/>
                        <div className={'menu_spacer'}/>
                        <div className={'menu_header'}>
                            HOT DRINKS
                        </div>
                        <div className={'menu_spacer'}/>
                        {
                            data.returnItems.filter(d => d.active === 1 && d.type === "hot-drink").sort((x, y) => x.order - y.order).map((data) => {
                                return (
                                    <div key={data.id}>
                                        <div className={'menu_sub_section_header'}>
                                            {data.name} ${data.price}
                                        </div>
                                        <div className={'menu_item_description'}>
                                            {data.description}
                                        </div>
                                    </div>
                                )
                            })
                        }

                        <div className={'menu_spacer'}/>
                        <div className={'menu_spacer'}/>
                        <div className={'menu_header'}>
                            WINE
                        </div>
                        <div className={'menu_spacer'}/>
                        {
                            data.returnItems.filter(d => d.active === 1 && d.type === "wine").sort((x, y) => x.order - y.order).map((data) => {
                                return (
                                    <div key={data.id}>
                                        <div className={'menu_sub_section_header'}>
                                            {data.name} <span className={'menu_item_description'}>{data.description}</span> - ${data.price}
                                        </div>
                                    </div>
                                )
                            })
                        }

                        <div className={'menu_spacer'}/>
                        <div className={'menu_spacer'}/>
                        <div className={'menu_header'}>
                            DRAFT LIST
                        </div>
                        <div className={'menu_spacer'}/>
                        {
                            data.returnItems.filter(d => d.active === 1 && d.type === "draft").sort((x, y) => x.order - y.order).map((data) => {
                                return (
                                    <div key={data.id}>
                                        <div className={'menu_sub_section_header'}>
                                            {data.name} <span className={'menu_item_description'}>{data.description}</span> - ${data.price}
                                        </div>
                                    </div>
                                )
                            })
                        }

                        <div className={'menu_spacer'}/>
                        <div className={'menu_spacer'}/>
                        <div className={'menu_header'}>
                            TALLBOYS
                        </div>
                        <div className={'menu_spacer'}/>
                        {
                            data.returnItems.filter(d => d.active === 1 && d.type === "tallboy").sort((x, y) => x.order - y.order).map((data) => {
                                return (
                                    <div key={data.id}>
                                        <div className={'menu_sub_section_header'}>
                                            {data.name} <span className={'menu_item_description'}>{data.description}</span>
                                            {data.price ? <span>- ${data.price}</span> : <span></span>}
                                        </div>
                                    </div>
                                )
                            })
                        }

                        <div className={'menu_spacer'}/>
                        <div className={'menu_spacer'}/>
                        <div className={'menu_header'}>
                            CIDER
                        </div>
                        <div className={'menu_spacer'}/>
                        {
                            data.returnItems.filter(d => d.active === 1 && d.type === "cider").sort((x, y) => x.order - y.order).map((data) => {
                                return (
                                    <div key={data.id}>
                                        <div className={'menu_sub_section_header'}>
                                            {data.name} <span className={'menu_item_description'}>{data.description}</span> - ${data.price}
                                        </div>
                                    </div>
                                )
                            })
                        }
                        
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
            )}
        </>
    );
}

export default Menu;
