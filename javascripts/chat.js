db.collection("chatList")
    .get()
    .then(docList => {
        docList.forEach(doc => {
            const chat = doc.data();
            const chatId = doc.id;

            firebase
                .auth()
                .onAuthStateChanged(user => {
                    if (user.email == "admin@gmail.com") {
                        const col = `
                        <div class="panel-heading">
                            <h3 class="panel-title">time：${chat.year}年${chat.month}月${chat.day}日${chat.hour}時
                            <br> => ${chat.email}</h3>
                        </div>
                        <div class="panel-body">
                            ${chat.word}
                            <br>
                            <br>
                            <button data-id="${chatId}" type="submit" class="btn btn-danger delete-text-btn" >刪除</button>
                        </div>
                        `;
                        $("#chatList").append(col)
                    } else {
                        const col = `
                        <div class="panel-heading">
                            <h3 class="panel-title">time：${chat.year}年${chat.month}月${chat.day}日${chat.hour}時
                            <br> => ${chat.email}</h3>
                        </div>
                        <div class="panel-body">
                            ${chat.word}
                            <br>
                            <br>
                        </div>
                        `;
                        $("#chatList").append(col)
                    }
                })
        });
    })
    .catch(err => console.log(err))


// 新增產品
$("#createTextForm").submit(function (e) {
    // prevent default behavior of browser
    e.preventDefault();
    console.log("New From Submitted !");

    var today = new Date();

    const chat = {
        email: $("#author").val(),
        word: $("#textbox").val(),
        year: today.getFullYear(),
        month: (today.getMonth() + 1),
        day: today.getDate(),
        hour: today.getHours(),
        minutes: today.getMinutes()
    };
    //console.log(chat);
    // Add Image to ImageList collection
    db.collection("chatList").add(chat)
        .then(() => {
            // refresh page
            window.location.reload();
        })
        .catch(err => console.log(err));
});

$("body").delegate(".delete-text-btn", "click", function () {
    const textId = $(this).attr("data-id")
    console.log(textId);
    db
        .doc(`chatList/${textId}`)
        .delete()
        .then(() => {
            alert("This text is removed");
            window.location.reload();
        })
        .catch(err => console.log(err))

});

firebase
    .auth()
    .onAuthStateChanged(user => {
        if (user) {
            // sign in
            console.log("sign in user", user);
            if (user.email != null) {
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