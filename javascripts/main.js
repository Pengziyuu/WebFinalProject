// Scripts start here...
// Create tagMap
const tagMap = {};
// Get all tags from db
db.collection("tagList")
    .get()
    .then(docList => {
        docList.forEach(doc => {
            // doc.id => the id of document
            //doc.data() => thr object data of the doc
            // console.log("[tag id]", doc.id);
            // console.log("[tag data]", doc.data());
            const tagId = doc.id;
            const tag = doc.data();
            // Save tagId as a property of tagMap
            tagMap[tagId] = tag;
        });
        // console.log("[tagMap in then func]", tagMap);
        // render product list
        renderProductList();
    })
    .catch(err => console.log("err", err))

function renderProductList() {
    // Get all the documents from productList collection
    db
        .collection("productList")
        .get()
        // Successfully get the data
        // .then(function(docList){})
        .then(docList => {
            // console.log("[docList]", docList);
            // loop all the doc from docList    
            docList.forEach(doc => {
                // console.log("[doc]", doc);
                // Get the data object from the doc
                const product = doc.data();
                //console.log(product);
                //badges HTML
                let badges = "";
                product.tags.forEach(tagId => {
                    const tag = tagMap[tagId];
                    badges += `<span class="badge badge-${tag.color}">
                        ${tag.name}
                        </span> `;
                });

                let priceHTML = `<span>$ ${product.price} NTD<span>`;
                // if (product.useSalePrice) {
                //     // if product.price is true
                //     priceHTML = `$
                //     <span class="text-danger">${product.salePrice}</span> 
                //     <s>${product.price}</s> NTD`
                // }
                var Today = new Date();
                const col = `                
                <div class="col-md-4 col-6">
                    <div class="card my-3">
                        <img class="card-img-top" src="${product.image}" alt="">
                        <div class="card-body">
                            <h4 class="card-title mb-0">${product.name}</h4>
                            <div class="category-list my-2">
                                ${badges}
                            </div>
                            <p class="price">
                                ${priceHTML}
                            </p>
                        </div>
                        <div class="card-footer">
                            Updated at ${Today.getFullYear()}.${(Today.getMonth() + 1)}.${Today.getDate()} <i class="far fa-calendar-alt"></i>
                        </div>
                    </div>
                </div>`;
                // Select an Element from web page
                // with an id="productList"
                $("#productList").append(col)
            })
        })
        // If some error happend
        // .catch(function(err){})
        .catch(err => {
            console.log("[err]", err);
        });
}

firebase
    .auth()
    .onAuthStateChanged((user) => {
        if (user) {
            //console.log(user);

            const col = `
        <h6 class="card-title mb-0">Account : ${user.email}</h6>
        `;
            $("#account").append(col)

        } else {
            //console.log("no user");
            const col = `
        <h7 class="card-title mb-0">No Account</h6>
        `;
            $("#account").append(col)
        }
    });
