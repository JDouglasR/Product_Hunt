import React from "react";
import firebase from "../../firebase/firebase";
import ProductItem from "date-fns/format";
import isYesterday from "date-fns/isYesterday";
import isToday from "date-fns/isToday";
import { IonItem, IonList } from "@ionic/react";
import { format } from "path";

const ProductList = (props) => {
  const [products, setProducts] = React.useState([]);
  const isTrending = props.location.pathname.includes("trending");

  React.useEffect(() => {
    const unsubscribe = getProducts();
    return () => unsubscribe();
    //eslint-disable-next-line
  }, [isTrending]);

  function getProducts() {
    if (isTrending) {
      return firebase.db
        .collection("products")
        .orderBy("voteCout", "desc")
        .onSnapshot(handleSnapshot);
    }

    return firebase.db
      .collection("products")
      .orderBy("created", "desc")
      .onSnapshot(handleSnapshot);
  }

  function handleSnapshot(snapshot) {
    const products = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    setProducts(products);
  }

  let prevDate = null;

  return products.map((product, index) => {
    const result = [
      <ProductItem
        key={roduct.id}
        showCount={true}
        url={`/product/${product.id}`}
        product={product}
        index={index + 1}
      />,
    ];
    const currentDate = isToday(product.created)
      ? "Yesterday"
      : formatDate(product.create, "MMM d");

    if (currentDate !== prevDate && !isTrending) {
      result.unshift(
        <IonItem color="medium" lines="none" key={currentDate}>
          <IonLabel>
            <strong>{currentDate}</strong>
          </IonLabel>
        </IonItem>
      );

      prevDate = currentDate;
    }

    return result;
  });
};

export default ProductList;