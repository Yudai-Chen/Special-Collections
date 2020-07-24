import React, { useState, useEffect } from "react";
import { getItemPath } from "../utils/Utils"
import { Breadcrumb, Spin } from "antd";

// baseAddress, itemId, itemTitle
const ItemBreadcrumb = (props) => {
    const [loading, setLoading] = useState(true);
    const [path, setPath] = useState([]);
    useEffect(() => {
        getItemPath(props.baseAddress, props.itemId).then((result) => setPath(result.reverse()));
    }, [props]);

    useEffect(() => {
        setLoading(false);
    }, [path])
    return loading ? <Spin /> : <Breadcrumb>{path.map((each, key) =>
        <Breadcrumb.Item key={key}>
            <Link to={"/admin/items/" + each["value_resource_id"]}>
                {each["display_title"]}
            </Link>
        </Breadcrumb.Item>
    )
    }
        <Breadcrumb.Item>{props.itemTitle}</Breadcrumb.Item>
    </Breadcrumb>
}

export default ItemBreadcrumb;