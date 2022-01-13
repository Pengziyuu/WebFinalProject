// Scripts start here...
// Product
var $productTableBody = $("#productTableBody");
// create product
var $createProductForm = $("#createProductForm");
var $createProductName = $("#createProductName");
var $createProductPrice = $("#createProductPrice");
var $createProductSalePrice = $("#createProductSalePrice");
var $createProductUseSalePrice = $("#createProductUseSalePrice");
var $createPostImage = $("#createPostImage");
var $createPostImageURL = $("#createPostImageURL");
var $imagePreview = $("#imagePreview");
var $createProductTags = $("#createProductTags");
var $productTableBody = $("#productTableBody");



// 顯示圖片
$createPostImage.change(function (e) {
    // Get the file object when user choose any files
    const file = this.files[0];
    const fileName = file.name;
    // Setup folder path for firebase storage
    const storagePath = `galleryImages/${fileName}`;
    const ref = firebase.storage().ref(storagePath);
    // Upload file to firebase storage
    console.log(`Start Upload image to: ${storagePath}`);
    //$createPostImageURL.text(`Start Upload image to: ${storagePath}`);
    ref.put(file)
        .then(snapshot => {
            // If file is uploaded successfully
            console.log(snapshot);
            // Get image URL
            ref.getDownloadURL()
                .then(imageURL => {
                    console.log("imageURL", imageURL);
                    $createPostImageURL.text(`${imageURL}`);

                    const col = `<img class="card-img-top" src="${imageURL}" alt="">`;
                    $imagePreview.append(col);
                })
                .catch(err => {
                    $createPostImageURL.text(`Error: ${err}`);
                    console.log(err)
                });
        })
        .catch(err => {
            $createPostImageURL.text(`Error: ${err}`);
            console.log(err)
        });
});

// 新增產品
$createProductForm.submit(function (e) {
    // prevent default behavior of browser
    e.preventDefault();
    console.log("New From Submitted !");

    const product = {
        name: $createProductName.val(),
        image: $createPostImageURL.text(),
        price: $createProductPrice.val(),
        // salePrice: $createProductSalePrice.val(),
        // useSalePrice: $createProductUseSalePrice.val(),
        tags: $createProductTags.val()
    };
    // Add Image to ImageList collection
    db.collection("productList").add(product)
        .then(() => {
            // refresh page
            window.location.reload();
        })
        .catch(err => console.log(err));
});

// 顯示產品
const foodList = [];
db.collection("productList").get()
    .then(docList => {
        docList.forEach(doc => {
            const food = doc.data();
            const foodId = doc.id;
            food['id'] = foodId;
            // add tag(object) to tagList(array)
            foodList.push(food);
        });
        renderFoodList();
    })
    .catch(err => console.log("err", err));

function renderFoodList() {
    foodList.forEach(food => {
        //console.log(food);
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
                //console.log(food);
                let badges = "";
                food.tags.forEach(tagId => {
                    const tag = tagMap[tagId];
                    badges += `<span class="badge badge-${tag.color}">
                        ${tag.name}
                        </span> `;
                });

                const tableRow = `<tr>
                    <tr>
                        <td><img height="50px" src=${food.image} alt=""></td>
                        <td>${food.name}</td>
                        <td>${food.price}</td>
                        <td>${badges}</td>
                        <td>
                            <button data-id="${food.id}" class="btn btn-warning update-food-btn">Update</button>
                            <button data-id="${food.id}" class="btn btn-danger delete-food-btn">Delete</button>
                        </td>
                     </tr>
                </tr>`
                $productTableBody.append(tableRow);

            })
            .catch(err => console.log("err", err))
    })
    // bootstrap selectpicker
}

$("body").delegate(".delete-food-btn", "click", function () {
    const foodId = $(this).attr("data-id")
    db
        .doc(`productList/${foodId}`)
        .delete()
        .then(() => {
            alert("This food is removed");
            window.location.reload();
        })
        .catch(err => console.log(err))

});

$("body").delegate(".update-food-btn", "click", function () {
    // Get tag id from button element
    const foodId = $(this).attr("data-id")
    // Find that object with the same id in tagList
    const food = foodList.find(t => {
        return t.id == foodId
    })

    console.log("foodId", foodId);
    console.log("tag", food);
    //Fill tag value in UI
    $("#updateFoodId").val(foodId)
    $("#updateProductName").val(food.name);
    $("#updateProductTags").val(food.tags);
    $("#updateProductPrice").val(food.price);

    $("#updateProductModal").modal();
});

$("#updateProductForm").submit(function (e) {
    // prevent browser to refresh
    e.preventDefault();
    // Gat tag ID
    const foodId = $("#updateFoodId").val()
    //Create new tag obj
    const food = {
        name: $("#updateProductName").val(),
        tags: $("#updateProductTags").val(),
        price: $("#updateProductPrice").val()
    };
    console.log(foodId, food)
    // Update data
    // .doc("COLLECTION/DOC_ID") 
    db.doc(`productList/${foodId}`)
        .update(food)
        .then(() => {
            alert("Updated!");
            window.location.reload();
        })
        .catch(err => console.log(err));
});

// ------------------------------------------------------------------------

// Tag
// select an element with id="tagTableBody"
var $tagTableBody = $("#tagTableBody");
// create tag
var $createTagForm = $("#createTagForm");
var $createTagName = $("#createTagName");
var $createTagColor = $("#createTagColor");

// Binding the event that user submitted $createTagForm
$createTagForm.submit(function (e) {
    // prevent default behavior of browser
    e.preventDefault();
    console.log("New Tag From Submitted !");
    const tag = {
        name: $createTagName.val(),
        color: $createTagColor.val()
    };
    // Add tag to tagList collection
    db.collection("tagList").add(tag)
        .then(() => {
            // refresh page
            window.location.reload();
        })
        .catch(err => console.log(err));
});

const tagList = [];

db.collection("tagList").get()
    .then(docList => {
        docList.forEach(doc => {
            const tag = doc.data();
            const tagId = doc.id;
            tag['id'] = tagId;
            // add tag(object) to tagList(array)
            tagList.push(tag);
        });
        renderTagList();
    })
    .catch(err => console.log("err", err));

function renderTagList() {
    tagList.forEach(tag => {
        //console.log(tagList);
        // Append option to create & update select UI
        $("#createProductTags, #updateProductTags").append(`
        <option value="${tag.id}">${tag.name}</option>
        `);

        // Create HTML table row for each tag
        const tableRow = `<tr>
            <td>${tag.name}</td>
            <td>
                <div class="color-box bg-${tag.color}"></div>
            </td>
            <td>
                <button data-id="${tag.id}" class="btn btn-warning update-tag-btn">Update</button>
                <button data-id="${tag.id}" class="btn btn-danger delete-tag-btn">Delete</button>
            </td>
        </tr>`;
        $tagTableBody.append(tableRow);
    })
    // bootstrap selectpicker
    $("#createProductTags, #updateProductTags").selectpicker();
}

$("body").delegate(".delete-tag-btn", "click", function () {
    const tagId = $(this).attr("data-id")
    db
        .doc(`tagList/${tagId}`)
        .delete()
        .then(() => {
            alert("This tag is removed");
            window.location.reload();
        })
        .catch(err => console.log(err))

});

// binding click for .update-tag-btn
$("body").delegate(".update-tag-btn", "click", function () {
    // Get tag id from button element
    const tagId = $(this).attr("data-id")
    // Find that object with the same id in tagList
    const tag = tagList.find(t => {
        return t.id == tagId
    })

    console.log("tagId", tagId);
    console.log("tag", tag);
    // Fill tag value in UI
    $("#updateTagId").val(tagId);
    $("#updateTagName").val(tag.name);
    $("#updateTagColor").val(tag.color);

    $("#updateTagModal").modal();
});

$("#updateTagForm").submit(function (e) {
    // prevent browser to refresh
    e.preventDefault();
    // Gat tag ID
    const tagId = $("#updateTagId").val()
    //Create new tag obj
    const tag = {
        name: $("#updateTagName").val(),
        color: $("#updateTagColor").val()
    };
    console.log(tagId, tag)
    // Update data
    // .doc("COLLECTION/DOC_ID") 
    db.doc(`tagList/${tagId}`)
        .update(tag)
        .then(() => {
            alert("Updated!");
            window.location.reload();
        })
        .catch(err => console.log(err));
});


firebase
    .auth()
    .onAuthStateChanged(user => {
        if (user) {
            // sign in
            console.log("sign in user", user);
            if (user.email == "admin@gmail.com") {
                $("#loader").fadeOut();
            } else { }

            const col = `
            <h6 class="card-title mb-0">Account : ${user.email}</h6>
            `;
            $("#account").append(col)
        } else {
            // sign out
            console.log("sign out", user)

            const col = `
            <h6 class="card-title mb-0">No Account</h6>
            `;
            $("#account").append(col)
        }
    })
