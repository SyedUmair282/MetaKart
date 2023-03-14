const sql = require("mssql");
const router = require("express").Router();
const axios = require("axios");
const bcrypt = require("bcryptjs");
// const validator = require('validator');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

router.get("/suggest/:prod/:limit", (req, res) => {
  req.app.locals.db.query(
    `select top(${req.params.limit}) * from product WHERE name LIKE '%${req.params.prod}%'`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(200).json(recordset.recordset);
    }
  );
});

router.get("/all/:limit", (req, res) => {
  req.app.locals.db.query(
    `select top(${req.params.limit}) * from product`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(200).json(recordset.recordset);
    }
  );
});

// REGISTRATION PROCESS
const sendMail = (email, name, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'digevoldevs@gmail.com',
        pass: 'vrrrakdeevotsepa'
      }
    })
    const mailOptions = {
      from: 'digevoldevs@gmail.com',
      to: email,
      subject: 'For verify your email',
      html: "<p>Hey " + name + " Please verify you mail.</p> <a href='http://192.168.1.9:5000/sql/verify?id=" + user_id + "'>Click here verify your mail</a>"

    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent==> ", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
router.post("/register", (req, res) => {
  const { username, email, password, first_name, last_name, phone } = req.body;
  req.app.locals.db.query(
    `EXEC LoginSpUsersSelect @email='${email}', @phone='${phone}'`,
    async function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
      } else {
        if (Object.keys(recordset.recordset).length !== 0) {
          res.status(200).json("Email already in use");
        } else {
          const verify = 0;
          const encrypt_pswd = await bcrypt.hash(password, 10);
          req.app.locals.db.query(
            `EXEC RegisterCreateUser @uname ='${username}' , @pswd ='${encrypt_pswd}' , @fname ='${first_name}' ,@lname ='${last_name}' , @email ='${email}' , @isVerified =${verify} , @phone='${mobile}'`,
            function (err, recordset) {
              if (err) {
                console.error(err);
                res.status(500).send("SERVER ERROR");
                return;
              } else {
                req.app.locals.db.query(
                  `EXEC RegisterGetUsernameAndId @email = '${email}'`,
                  function (err, recordset) {
                    if (err) {
                      console.error(err);
                      res.status(500).send("SERVER ERROR");
                      return;
                    }
                    const token = jwt.sign(
                      {
                        user_id: recordset.recordset[0].user_id,
                        user_name: recordset.recordset[0].username,
                      },
                      process.env.SECRET_KEY
                    );
                    res
                      .status(201)
                      .json({ user: recordset.recordset, token: token });
                    const user_id = recordset.recordset[0].user_id;
                    sendMail(email, first_name, user_id);
                  }
                );
              }
            }
          );
        }
      }
    }
  );
});

router.get("/verify", (req, res) => {
  req.app.locals.db.query(
    `update users set isVerified=1 where user_id=${req.query.id}`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      } else {
        res.render("index");
      }
    }
  );
});
//REGISTRATION PROCESS END

const auth = require("../middlewares/auth");
router.post("/login", (req, res) => {
  const { email, password, phone } = req.body;
  req.app.locals.db.query(
    `EXEC LoginSpUsersSelect @email='${email}', @phone='${phone}'`,
    async function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
      } else {
        if (Object.keys(recordset.recordset).length !== 0) {
          const matchedPassword = await bcrypt.compare(
            password,
            recordset.recordset[0].password
          );
          if (matchedPassword && recordset.recordset[0].isVerified === true) {
            const token = jwt.sign(
              {
                user_id: recordset.recordset[0].user_id,
                user_name: recordset.recordset[0].username,
              },
              process.env.SECRET_KEY
            );
            req.session.user_id = recordset.recordset[0].user_id;
            req.app.locals.db.query(
              `EXEC LoginSpSessionSelect @id=${req.session.user_id}`,
              function (err, recordset) {
                if (err) {
                  console.error(err);
                  res.status(500).send("SERVER ERROR");
                  return;
                } else {
                  if (Object.keys(recordset.recordset).length !== 0) {
                    req.app.locals.db.query(
                      `EXEC LoginSpSessionUpdate @id =${req.session.user_id}`,
                      function (err, recordset) {
                        if (err) {
                          console.error(err);
                          res.status(500).send("SERVER ERROR");
                          return;
                        }
                      }
                    );
                  } else {
                    req.app.locals.db.query(
                      `EXEC LoginSpSessionInsert @id =${req.session.user_id}`,
                      function (err, recordset) {
                        if (err) {
                          console.error(err);
                          res.status(500).send("SERVER ERROR");
                          return;
                        }
                      }
                    );
                  }
                }
              }
            );
            res.status(201).json({ user: recordset.recordset, token: token });
          } else {
            res.status(400).json("Wrong credential");
          }
        } else {
          res.status(400).json("Wrong credential");
        }
      }
    }
  );
});
router.get("/allVenders", (req, res) => {
  req.app.locals.db.query(`select * from vendors`, function (err, recordset) {
    if (err) {
      console.error(err);
      res.status(500).send("SERVER ERROR");
      return;
    }
    res.status(200).json(recordset.recordset);
  });
});

router.get("/venderProduct/:id/:limit", (req, res) => {
  req.app.locals.db.query(
    `select top(${req.params.limit}) * from product where vendor_id = ${req.params.id}`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(200).json(recordset.recordset);
    }
  );
});

router.get("/popular/:limit", (req, res) => {
  req.app.locals.db.query(
    `SELECT top(${req.params.limit}) SUM(order_items.quantity) as total_Orders, order_items.product_id,product.name,product.price,product.imgs,product.discount_id,product.inventory_id,product.category_id,product.vendor_id,product.rating,product.isDeleted,product.inStock
  FROM order_items
  INNER JOIN product ON order_items.product_id = product.product_id
  WHERE product.isDeleted=0
  GROUP BY order_items.product_id, product.name,product.price,product.imgs,product.discount_id,product.inventory_id,product.category_id,product.vendor_id,product.rating,product.isDeleted,product.inStock
  ORDER BY total_Orders desc , rating desc , product_id asc`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(200).json(recordset.recordset);
    }
  );
});

router.get("/allDiscountProducts/:limit", (req, res) => {
  //ALL DISCOUNTED PRODUCTS
  req.app.locals.db.query(
    `select top(${req.params.limit}) product.* , discount.discount_percent , discount.active
  from product
  inner join discount on product.discount_id = discount.discount_id`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(200).json(recordset.recordset);
    }
  );
});

router.get("/allCategories", (req, res) => {
  req.app.locals.db.query(
    `select * from product_category`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(200).json(recordset.recordset);
    }
  );
});

router.get("/getSubCategories/:parentId", (req, res) => {
  req.app.locals.db.query(
    `select * from Category_hierarchy where HierParent = ${req.params.parentId}`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(200).json(recordset.recordset);
    }
  );
});

router.get("/allCategoryProducts/:limit/:parentCateg", (req, res) => {
  //products of a certain cateory
  req.app.locals.db.query(
    `select top(${req.params.limit}) * from product where category_id = ${req.params.parentCateg}`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(200).json(recordset.recordset);
    }
  );
});

router.get("/subCategoryProducts/:limit/:hierId", (req, res) => {
  //products of a certain cateory
  req.app.locals.db.query(
    `select top(${req.params.limit}) * from product where HierId like '${req.params.hierId}%'`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(200).json(recordset.recordset);
    }
  );
});

router.post("/addCartItem", auth.isLogin, (req, res) => {
  const { product_id, quantity, user_id } = req.body;
  req.app.locals.db.query(
    `select * from cart_item where product_id=${product_id} and user_id=${user_id}`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      } else {
        if (Object.keys(recordset.recordset).length !== 0) {
          if (recordset.recordset[0].is_deleted === true) {
            req.app.locals.db.query(
              `update cart_item set quantity=${quantity} , is_deleted = 0 where product_id=${product_id} and user_id=${user_id}`,
              function (err, recordset) {
                if (err) {
                  console.error(err);
                  res.status(500).send("SERVER ERROR");
                  return;
                }
                res.status(201).send("Data updated successfully");
              }
            );
          } else {
            req.app.locals.db.query(
              `update cart_item set quantity=${quantity}+${recordset.recordset[0].quantity} where product_id=${product_id} and user_id=${user_id}`,
              function (err, recordset) {
                if (err) {
                  console.error(err);
                  res.status(500).send("SERVER ERROR");
                  return;
                }
                res.status(201).send("Data updated successfully");
              }
            );
          }
        } else {
          req.app.locals.db.query(
            `insert into cart_item (product_id,quantity,user_id,is_deleted) values (${product_id},${quantity},${user_id},0)`,
            function (err, recordset) {
              if (err) {
                console.error(err);
                res.status(500).send("SERVER ERROR");
                return;
              }
              res.status(201).send("Data added successfully");
            }
          );
        }
      }
    }
  );
});
router.post("/getCartItem", auth.isLogin, (req, res) => {
  const { user_id } = req.body
  req.app.locals.db.query(
    `select product.* , cart_item.user_id , cart_item.quantity
  from product
  inner join cart_item on product.product_id = cart_item.product_id
  where user_id=${user_id} and is_deleted=0`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      } else {
        // if(Object.keys(recordset.recordset).length !== 0){
        //   res.status(201).json(recordset.recordset)
        // }
        // else{
        //   res.status(201).send("No data")
        // }
        res.status(201).json(recordset.recordset);
      }
    }
  );
});

router.post("/delCartItem", (req, res) => {
  const { product_id, user_id } = req.body;
  req.app.locals.db.query(
    `select * from cart_item where product_id=${product_id} and user_id=${user_id}`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      } else {
        if (Object.keys(recordset.recordset).length !== 0) {
          if (recordset.recordset[0].quantity > 1) {
            req.app.locals.db.query(
              `update cart_item set quantity=(${recordset.recordset[0].quantity} - 1) where product_id=${product_id} and user_id=${user_id}`,
              function (err, recordset) {
                if (err) {
                  console.error(err);
                  res.status(500).send("SERVER ERROR");
                  return;
                }
                res.status(201).send("Data updated successfully");
              }
            );
          } else {
            res.status(200).send("No more quantity to delete");
          }
        } else {
          res.send("No data to delete");
        }
      }
    }
  );
});

router.post("/deleteFromCart", (req, res) => {
  const { product_id, user_id } = req.body;
  req.app.locals.db.query(
    `update cart_item set is_deleted = 1 where product_id=${product_id} and user_id=${user_id}`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
    }
  );
});


router.get("/filterAllByPrice/:ascDesc/:limit", (req, res) => {
  req.app.locals.db.query(
    `select top(${req.params.limit}) * from product order by price ${req.params.ascDesc}`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(200).json(recordset.recordset);
    }
  );
});

router.get("/filterAllByRating/:ascDesc/:limit", (req, res) => {
  req.app.locals.db.query(
    `select top(${req.params.limit}) * from product order by rating ${req.params.ascDesc}`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(200).json(recordset.recordset);
    }
  );
});

router.get("/filterPopularByPrice/:ascDesc/:limit", (req, res) => {
  req.app.locals.db.query(
    `SELECT top(${req.params.limit}) SUM(order_items.quantity) as total_Orders, order_items.product_id,product.name,product.price,product.imgs,product.discount_id,product.inventory_id,product.category_id,product.vendor_id,product.rating,product.isDeleted,product.inStock
  FROM order_items
  INNER JOIN product ON order_items.product_id = product.product_id
  GROUP BY order_items.product_id, product.name,product.price,product.imgs,product.discount_id,product.inventory_id,product.category_id,product.vendor_id,product.rating,product.isDeleted,product.inStock
  ORDER BY price ${req.params.ascDesc}, total_Orders desc`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(200).json(recordset.recordset);
    }
  );
});

router.get("/filterPopularByRating/:ascDesc/:limit", (req, res) => {
  req.app.locals.db.query(
    `SELECT top(${req.params.limit}) SUM(order_items.quantity) as total_Orders, order_items.product_id,product.name,product.price,product.imgs,product.discount_id,product.inventory_id,product.category_id,product.vendor_id,product.rating,product.isDeleted,product.inStock
  FROM order_items
  INNER JOIN product ON order_items.product_id = product.product_id
  GROUP BY order_items.product_id, product.name,product.price,product.imgs,product.discount_id,product.inventory_id,product.category_id,product.vendor_id,product.rating,product.isDeleted,product.inStock
  ORDER BY rating ${req.params.ascDesc}, total_Orders desc`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(200).json(recordset.recordset);
    }
  );
});

router.post("/addAddress", (req, res) => {
  const address = req.body;
  req.app.locals.db.query(
    `insert into user_address (user_id,address_line,city,country,mobile,recipent,address_title) values(${address.user_id},'${address.address}','Karachi','Pakistan','${address.phone}','${address.recipent}','${address.title}')`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(200).json(recordset.recordset);
    }
  );
});

router.put("/deleteAddress/:address_id", (req, res) => {
  req.app.locals.db.query(
    `update user_address set isDeleted = 1 where address_id = ${req.params.address_id}`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(200).json(recordset.recordset);
    }
  );
});

router.put("/updateAddress/:address_id", (req, res) => {
  const address = req.body;
  req.app.locals.db.query(
    `update user_address set address_line = '${address.address}', mobile='${address.phone}' , recipent='${address.recipent}', address_title='${address.title}' where address_id = ${req.params.address_id}`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(200).json(recordset.recordset);
    }
  );
});

// router.get('/check',auth.isLogin,(req,res)=>{
//   res.send(req.user_id)
// })


router.post('/session', auth.isLogoutSession, (req, res) => {
  const { user_id } = req.body
  req.app.locals.db.query(`update shopping_session set status='disable' where user_id=${user_id}`, function (err, recordset) {
    if (err) {
      console.error(err)
      res.status(500).send('SERVER ERROR')
      return
    }
    else {
      res.status(201).send("Status updated")
    }
  })
});


router.post('/logout', auth.isLogout, (req, res) => {
  req.session.destroy();
  res.clearCookie('ecomm_session')
  console.log("session==>", req.session)
  const { user_id } = req.body
  req.app.locals.db.query(`update shopping_session set status='disable' where user_id=${user_id}`, function (err, recordset) {
    if (err) {
      console.error(err)
      res.status(500).send('SERVER ERROR')
      return
    }
    else {
      res.status(201).send("Status updated")
    }
  })
});


router.post("/setOrderDetails", (req, res) => {
  const { amount, prodArr, user_id } = req.body;
  req.app.locals.db.query(
    `insert into payment_details (amount,provider,status,user_id) values (${amount},'Cash On Delivery',0,${user_id})`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      } else {
        req.app.locals.db.query(
          `select top(1) * from payment_details where USER_ID=${user_id} order by created_at desc`,
          function (err, recordset) {
            if (err) {
              console.error(err);
              res.status(500).send("SERVER ERROR");
              return;
            } else {
              req.app.locals.db.query(
                `insert into order_details (user_id,total,payment_id,orderStatus) values (${recordset.recordset[0].user_id},${recordset.recordset[0].amount},${recordset.recordset[0].payment_id},'pending')`,
                function (err, recordset) {
                  if (err) {
                    console.error(err);
                    res.status(500).send("SERVER ERROR");
                    return;
                  } else {
                    req.app.locals.db.query(
                      `select top(1) * from order_details where USER_ID=${user_id} order by created_at desc`,
                      function (err, recordset) {
                        if (err) {
                          console.error(err);
                          res.status(500).send("SERVER ERROR");
                          return;
                        } else {
                          for (let index = 0; index < prodArr.length; index++) {
                            req.app.locals.db.query(
                              `insert into order_items (order_id,product_id,quantity,user_id,orderStatus) values (${recordset.recordset[0].order_id},${prodArr[index].product_id},${prodArr[index].quantity},${user_id},'pending');`,
                              function (err, recordset) {
                                if (err) {
                                  console.error(err);
                                  res.status(500).send("SERVER ERROR");
                                  return;
                                }
                              }
                            );
                          }
                          prodArr.forEach((element) => {
                            req.app.locals.db.query(
                              `update cart_item set is_deleted = 1 where product_id=${element.product_id} and user_id=${user_id}`,
                              function (err, recordset) {
                                if (err) {
                                  console.error(err);
                                  res.status(500).send("SERVER ERROR");
                                  return;
                                }
                              }
                            );
                          });
                          res.status(201).json(prodArr);
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

router.post('/getOrderDetails/:limit', auth.isLogin, (req, res) => {
  const { user_id } = req.body
  req.app.locals.db.query(`select top(${req.params.limit}) order_items.item_id,order_details.created_at,order_details.total,order_items.order_id,order_items.product_id,order_items.quantity,product.imgs,product.name,product.price,order_items.quantity*product.price AS total_item_price,order_details.orderStatus,payment_details.status
  from order_items
  inner join order_details on order_items.order_id = order_details.order_id
  inner join product on order_items.product_id = product.product_id
  inner join payment_details on order_details.payment_id = payment_details.payment_id
  where order_items.user_id=${user_id}
  order by order_details.created_at desc`, function (err, recordset) {
    if (err) {
      console.error(err)
      res.status(500).send('SERVER ERROR')
      return
    }
    else {
      res.status(201).json(recordset.recordset)
    }
  })
})

router.get("/getAddress/:user_id", (req, res) => {
  req.app.locals.db.query(`select * from user_address where user_id = ${req.params.user_id} and isDeleted = 0`, function (err, recordset) {
    if (err) {
      console.error(err);
      res.status(500).send("SERVER ERROR");
      return;
    } else {
      res.status(201).json(recordset.recordset);
    }
  }
  );
});

router.get("/getAddress/:user_id", (req, res) => {
  req.app.locals.db.query(
    `select * from user_address where user_id = ${req.params.user_id} and isDeleted = 0`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(200).json(recordset.recordset);
    }
  );
});

// router.get("/getSingleAddress/:address_id", (req,res) =>{
//   req.app.locals.db.query(`select * from user_address where address_id = ${req.params.address_id} and isDeleted = 0`, function(err, recordset) {
//       if (err) {
//         console.error(err)
//         res.status(500).send('SERVER ERROR')
//         return
//       }
//       res.status(200).json(recordset.recordset)
//     })
// })

router.post("/giveRating", (req, res) => {
  const ratingColumnNames = [
    "one_star_ratings",
    "two_star_ratings",
    "three_star_ratings",
    "four_star_ratings",
    "five_star_ratings",
  ];
  const bodyData = req.body;
  req.app.locals.db.query(
    `insert into user_reviews values(${bodyData.user_id},${bodyData.product_id
    },'${bodyData.userReview}' , ${bodyData.userRating})
  update product set ${ratingColumnNames[bodyData.userRating - 1]} = (${ratingColumnNames[bodyData.userRating - 1]
    } + 1) , numberOfRatings=(numberOfRatings+1) where product_id = ${bodyData.product_id
    }
  DECLARE @isRatingNull float
  select @isRatingNull =  rating from product where product_id = ${bodyData.product_id
    }
  if @isRatingNull is not null
  BEGIN
    update product set rating = ( ((1*one_star_ratings)+(2*two_star_ratings)+(3*three_star_ratings)+(4*four_star_ratings)+(5*five_star_ratings))/(numberOfRatings) ) where product_id=${bodyData.product_id
    }
  END
  
  ELSE
  BEGIN
    update product set rating = ${bodyData.userRating} where product_id=${bodyData.product_id
    }
  END`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(200).json(recordset.recordset);
    }
  );
});

router.get("/hasUserRated", (req, res) => {
  const checkRated = req.body;
  req.app.locals.db.query(
    `select * from user_reviews where user_id = ${checkRated.user_id} and product_id =${checkRated.product_id}`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      if (Object.keys(recordset.recordset).length !== 0) {
        res.status(200).json(true);
      } else {
        res.status(200).json(false);
      }
    }
  );
});

router.post("/updateNotifyToken", (req, res) => {
  const { user_id, token } = req.body
  req.app.locals.db.query(`select * from notification_Tokens where fcmToken='${token}'`, function (err, recordset) {
    if (err) {
      console.error(err)
      res.status(500).send('SERVER ERROR')
      return
    } else {
      if (Object.keys(recordset.recordset).length === 0) {
        req.app.locals.db.query(`insert into notification_Tokens (fcmToken , user_id) values('${token}' , ${user_id})`, function (err, recordset) {
          if (err) {
            console.error(err)
            res.status(500).send('SERVER ERROR')
            return
          }
          res.status(200).send('inserted');
        })
      } else {
        if (recordset.recordset[0].user_id === user_id) {
          res.status(200).send("old Token and same user")
        } else {
          req.app.locals.db.query(`update notification_Tokens set user_id=${user_id} where tokenId =${recordset.recordset[0].tokenId}`, function (err, recordset) {
            if (err) {
              console.error(err)
              res.status(500).send('SERVER ERROR')
              return
            }
            res.status(200).send('updated user');

          })
        }
      }
    }
  })

})
// router.post("/updateNotifyToken", (req,res)=>{
//   const {user_id , token} = req.body
//   req.app.locals.db.query(`update users set Notification_Token = '${token}' where user_id = ${user_id}`, function (err, recordset) {
//     if (err) {
//       console.error(err)
//       res.status(500).send('SERVER ERROR')
//       return
//     }else{
//       res.status(200).send('Done')
//     }
//   })

// })

/*========================================================================================================*/

//VENDOR PORTAL//
router.post("/registerVendor", (req, res) => {
  const { username, email, password, mobile, first_name, last_name, vendorId } =
    req.body;
  req.app.locals.db.query(
    `select * from users where email='${email}'`,
    async function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
      } else {
        if (Object.keys(recordset.recordset).length !== 0) {
          res.status(200).json("Email already in use");
        } else {
          const verify = 0;
          const encrypt_pswd = await bcrypt.hash(password, 10);
          req.app.locals.db.query(
            `insert into users (username , password,first_name,last_name,telephone,email,vendor_id,isVerified) values('${username}' , '${encrypt_pswd}' , '${first_name}','${last_name}','${mobile}','${email}',${vendorId},${verify})`,
            function (err, recordset) {
              if (err) {
                console.error(err);
                res.status(500).send("SERVER ERROR");
                return;
              } else {
                req.app.locals.db.query(
                  `select user_id, username from users where email = '${email}' AND vendor_id IS NOT NULL`,
                  function (err, recordset) {
                    if (err) {
                      console.error(err);
                      res.status(500).send("SERVER ERROR");
                      return;
                    }
                    const token = jwt.sign(
                      {
                        user_id: recordset.recordset[0].user_id,
                        user_name: recordset.recordset[0].username,
                      },
                      process.env.SECRET_KEY
                    );
                    res
                      .status(201)
                      .json({ user: recordset.recordset, token: token });
                    const user_id = recordset.recordset[0].user_id;
                    sendMail(email, first_name, user_id);
                  }
                );
              }
            }
          );
        }
      }
    }
  );
});

router.post("/loginVendor", (req, res) => {
  const { email, password } = req.body;
  req.app.locals.db.query(
    `select * from users where email='${email}' and vendor_id IS NOT NULL`,
    async function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
      } else {
        if (Object.keys(recordset.recordset).length !== 0) {
          const matchedPassword = await bcrypt.compare(
            password,
            recordset.recordset[0].password
          );
          if (matchedPassword && recordset.recordset[0].isVerified === true) {
            const token = jwt.sign(
              {
                user_id: recordset.recordset[0].user_id,
                user_name: recordset.recordset[0].username,
              },
              process.env.SECRET_KEY
            );
            res.status(201).json({ user: recordset.recordset, token: token });
          } else {
            res.status(400).json("Wrong credential");
          }
        } else {
          res.status(400).json("Wrong credential");
        }
      }
    }
  );
});


router.post("/UpdateOrder", (req, res) => {
  const { orderStatus, item_id } = req.body;
  req.app.locals.db.query(
    `update order_items set orderStatus = '${orderStatus}' where item_id = ${item_id}`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      } else {
        req.app.locals.db.query(`select fcmToken from notification_Tokens where user_id = (select user_id from order_items where item_id = ${item_id})`, function (err, recordset) {
          if (err) {
            console.error(err);
            res.status(500).send("SERVER ERROR");
            return;
          }
          else {
            recordset.recordset.map(async (element) => {
              try {
                const bodyData = {
                  to: element.fcmToken,
                  notification: {
                    title: "Status Updated",
                    body: `Order Status changed to ${orderStatus}`
                  }
                }
                const res = await axios.post('https://fcm.googleapis.com/fcm/send', bodyData, {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `key=${process.env.SERVER_KEY}`,
                  }
                })
                //console.log(res);
              } catch (err) {
                res.status(500).send("SERVER ERROR", err);
                return
              }
            })
            res.status(200).send('allDone')
          }
        })
      }
    }
  );
});

router.post('/createSection', (req, res) => {
  let sectionHier = 0;
  // let subSectionHier = 0;
  let sectionArr;

  // const { sectionName, sectionDesc, vendorId } = req.body
  const bodyArr = req.body

  req.app.locals.db.query(`select top(1) idMain, sectionName , SectionId.ToString() as SectionId , SectionId.GetLevel() as level , vendor_id from SectionTest where SectionId.GetLevel() = 1 order by idMain desc;`, function (err, recordset) {
    if (err) {
      console.error(err);
      res.status(500).send("SERVER ERROR");
      return;
    } else {
      if (recordset.recordset.length === 0) {
        sectionHier = 0
      } else {
        sectionArr = recordset.recordset[0].SectionId.split("/");
        sectionHier = parseInt(sectionArr[1])
      }

      bodyArr.forEach(element => {
        if (sectionHier === 0) {
          let subSectionHier = 0;
          sectionHier = 1;
          req.app.locals.db.query(`insert into SectionTest(SectionId , sectionName , sectionDesc ,vendor_id) values(CAST('/${sectionHier.toString()}/' as Hierarchyid) , '${element.section_name}' , '${element.description}' , ${element.vendorId})`, function (err, recordset) {
            if (err) {
              console.error(err);
              //res.status(500).send("SERVER ERROR");
              return;
            }
          })

          element.corners.forEach(subElement => {
            subSectionHier++
            req.app.locals.db.query(`insert into SectionTest(SectionId , sectionName , sectionDesc ,vendor_id) values(CAST('/${sectionHier.toString()}/${subSectionHier.toString()}/' as Hierarchyid) , '${subElement.corner_name}' , '${subElement.description}' , ${element.vendorId})`, function (err, recordset) {
              if (err) {
                console.error(err);
                res.status(500).send("SERVER ERROR");
                return;
              }
            })
          });

        } else {
          let subSectionHier = 0;
          sectionHier++
          req.app.locals.db.query(`insert into SectionTest(SectionId , sectionName , sectionDesc ,vendor_id) values(CAST('/${sectionHier.toString()}/' as Hierarchyid) , '${element.section_name}' , '${element.description}' , ${element.vendorId})`, function (err, recordset) {
            if (err) {
              console.error(err);
              //res.status(500).send("SERVER ERROR");
              return;
            }
          })

          element.corners.forEach(subElement => {
            subSectionHier++
            req.app.locals.db.query(`insert into SectionTest(SectionId , sectionName , sectionDesc ,vendor_id) values(CAST('/${sectionHier.toString()}/${subSectionHier.toString()}/' as Hierarchyid) , '${subElement.corner_name}' , '${subElement.description}' , ${element.vendorId})`, function (err, recordset) {
              if (err) {
                console.error(err);
                res.status(500).send("SERVER ERROR");
                return;
              }
            })
          });
        }
      })


    }
  })

  res.status(200).send('Done')
})


router.post('/sectionCheck', (req, res) => {
  let sectionHier = 0;
  let subSectionHier;
  let sectionArr;

  // const { sectionName, sectionDesc, vendorId } = req.body
  //const bodyArr = req.body

  req.app.locals.db.query(`select top(1) idMain, sectionName , SectionId.ToString() as SectionId , SectionId.GetLevel() as level , vendor_id from SectionTest where SectionId.GetLevel() = 1 order by idMain desc;
  select top(1) idMain, sectionName , SectionId.ToString() as SectionId , SectionId.GetLevel() as level , vendor_id from SectionTest where SectionId.GetLevel() = 2 AND vendor_id=4 order by idMain desc;
`, function (err, recordset) {
    if (err) {
      console.error(err);
      res.status(500).send("SERVER ERROR");
      return;
    }
    subSectionHier = recordset.recordsets[1][0].SectionId.split("/");
    console.log(subSectionHier[2]);
    res.status(200).send(subSectionHier[2])
  })
})


//VENDOR PORTAL

/*========================================================================================================*/

//======================================================================
router.post("/setFavourites", auth.isLogin, (req, res) => {
  const { favouritedProd, user_id } = req.body;
  req.app.locals.db.query(
    `select * from favourites where userId = ${user_id} and favouritedProd = ${favouritedProd}`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      } else {
        if (Object.keys(recordset.recordset).length !== 0) {
          req.app.locals.db.query(
            `update favourites set is_deleted=0 where userId=${user_id} and favouritedProd=${favouritedProd}`,
            function (err, recordset) {
              if (err) {
                console.error(err);
                res.status(500).send("SERVER ERROR");
                return;
              } else {
                req.app.locals.db.query(
                  `select product.imgs,favourites.is_deleted,product.name,product.numberOfRatings,product.price,product.product_id,product.discount_id,discount.discount_percent from product
                  inner join favourites on product.product_id=favourites.favouritedProd 
                  left join discount  on product.discount_id = discount.discount_id
                  where favourites.userId=${user_id} and favourites.is_deleted=0`,
                  function (err, recordset) {
                    if (err) {
                      console.error(err);
                      res.status(500).send("SERVER ERROR");
                      return;
                    } else {
                      res.status(201).json(recordset.recordset);
                    }
                  }
                );
              }
            }
          );
        } else {
          req.app.locals.db.query(
            `insert into favourites (favouritedProd,userId,is_deleted) values (${favouritedProd},${user_id},0)`,
            function (err, recordset) {
              if (err) {
                console.error(err);
                res.status(500).send("SERVER ERROR");
                return;
              } else {
                req.app.locals.db.query(
                  `select product.imgs,favourites.is_deleted,product.name,product.numberOfRatings,product.price,product.product_id,product.discount_id,discount.discount_percent from product
                  inner join favourites on product.product_id=favourites.favouritedProd 
                  left join discount  on product.discount_id = discount.discount_id
                  where favourites.userId=${user_id} and favourites.is_deleted=0`,
                  function (err, recordset) {
                    if (err) {
                      console.error(err);
                      res.status(500).send("SERVER ERROR");
                      return;
                    } else {
                      res.status(201).json(recordset.recordset);
                    }
                  }
                );
              }
            }
          );
        }
      }
    }
  );
});
//======================================================================

router.post("/delFavourites", auth.isLogin, (req, res) => {
  const { favouritedProd, user_id } = req.body;
  req.app.locals.db.query(
    `update favourites set is_deleted=1 where userId=${user_id} and favouritedProd=${favouritedProd}`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      } else {
        req.app.locals.db.query(
          `  select product.imgs,favourites.is_deleted,product.name,product.numberOfRatings,product.price,product.product_id,product.discount_id,discount.discount_percent from product
          inner join favourites on product.product_id=favourites.favouritedProd 
          left join discount  on product.discount_id = discount.discount_id
          where favourites.userId=${user_id} and favourites.is_deleted=0`,
          function (err, recordset) {
            if (err) {
              console.error(err);
              res.status(500).send("SERVER ERROR");
              return;
            } else {
              res.status(201).json(recordset.recordset);
            }
          }
        );
      }
    }
  );
});


router.post("/getFavourites", auth.isLogin, (req, res) => {
  const { user_id } = req.body
  req.app.locals.db.query(
    `select product.imgs,favourites.is_deleted,product.name,product.numberOfRatings,product.price,product.product_id,product.discount_id,discount.discount_percent from product
    inner join favourites on product.product_id=favourites.favouritedProd 
    left join discount  on product.discount_id = discount.discount_id
    where favourites.userId=${user_id} and favourites.is_deleted=0`,
    function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      } else {
        res.status(201).json(recordset.recordset);
      }

    }
  );
});


const sendOtpMail = (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'digevoldevs@gmail.com',
        pass: 'vrrrakdeevotsepa'
      }
    })
    const mailOptions = {
      from: 'digevoldevs@gmail.com',
      to: email,
      subject: 'OTP For Password Reset',
      html: "<p>Your OTP code for Password Reset is : <strong>" + otp + "</strong></p>"

    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent==> ", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

router.post("/sendOTP", (req, res) => {
  const { email } = req.body
  let userId;
  req.app.locals.db.query(`EXEC RegisterGetUsernameAndId @email = '${email}'`, function (err, recordset) {
    if (err) {
      console.error(err);
      res.status(500).send("SERVER ERROR");
      return;
    } else {
      if (Object.keys(recordset.recordset).length !== 0) {

        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < 6; i++) {
          otp += digits[Math.floor(Math.random() * 10)];
        }
        userId = recordset.recordset[0].user_id
        req.app.locals.db.query(`EXEC OTPCheckIfAlreadyExists @userId = ${userId}`, function (err, recordset) {
          if (err) {
            console.error(err);
            res.status(500).send("SERVER ERROR");
            return;
          } else {
            if (Object.keys(recordset.recordset).length !== 0) {
              req.app.locals.db.query(`
              EXEC OTPUpdate @userId =${userId} , @otp = '${otp}'
              `, function (err, recordset) {
                if (err) {
                  console.error(err);
                  res.status(500).send("SERVER ERROR");
                  return;
                } else {
                  sendOtpMail(email, otp)
                  res.status(201).send(true);
                }

              }
              );
            } else {
              req.app.locals.db.query(`
              EXEC OTPInsert @userId =${userId} , @otp = '${otp}' , @email='${email}'
              `, function (err, recordset) {
                if (err) {
                  console.error(err);
                  res.status(500).send("SERVER ERROR");
                  return;
                } else {
                  sendOtpMail(email, otp)
                  res.status(201).send(true);
                }

              }
              );
            }
          }
        }
        );

      } else {
        res.status(201).send(false);
      }
    }

  }
  );
});

router.post("/matchOTP", (req, res) => {
  const { otp, email } = req.body
  req.app.locals.db.query(`EXEC OTPMatch @otp='${otp}' ,@email = '${email}'`, function (err, recordset) {
    if (err) {
      console.error(err);
      res.status(500).send("SERVER ERROR");
      return;
    } else {
      if (Object.keys(recordset.recordset).length !== 0) {
        res.status(201).send(true);
      } else {
        res.status(201).send(false);
      }
    }

  }
  );
});

router.post("/OTPExpire", (req, res) => {
  const { email } = req.body

  setTimeout(() => {
    req.app.locals.db.query(`EXEC OTPExpire @email = '${email}'`, function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(201).send(recordset.recordset)

    }
    );
  }, 60000);

});

router.post("/setNewPswd", async (req, res) => {
  const { email,password } = req.body

    const encrypt_pswd = await bcrypt.hash(password, 10);
    req.app.locals.db.query(`EXEC UpdatePswd @email = '${email}' , @pswd='${encrypt_pswd}'`, function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
        return;
      }
      res.status(201).send(true)
    }
    );
});


router.post("/loginWithAuth", (req, res) => {
  const {username, password,first_name,last_name,email,isVerified,phone,vendor_id } = req.body;
  req.app.locals.db.query(
    `EXEC LoginSpUsersSelect @email='${email}', @phone='${phone}'`,
    async function (err, recordset) {
      if (err) {
        console.error(err);
        res.status(500).send("SERVER ERROR");
      } else {
        if (Object.keys(recordset.recordset).length !== 0) {
          
          if (recordset.recordset[0].isVerified === true) {
            const token = jwt.sign(
              {
                user_id: recordset.recordset[0].user_id,
                user_name: recordset.recordset[0].username,
              },
              process.env.SECRET_KEY
            );
            req.session.user_id = recordset.recordset[0].user_id;
            req.app.locals.db.query(
              `EXEC LoginSpSessionSelect @id=${req.session.user_id}`,
              function (err, recordset) {
                if (err) {
                  console.error(err);
                  res.status(500).send("SERVER ERROR");
                  return;
                } else {
                  if (Object.keys(recordset.recordset).length !== 0) {
                    req.app.locals.db.query(
                      `EXEC LoginSpSessionUpdate @id =${req.session.user_id}`,
                      function (err, recordset) {
                        if (err) {
                          console.error(err);
                          res.status(500).send("SERVER ERROR");
                          return;
                        }
                      }
                    );
                  } else {
                    req.app.locals.db.query(
                      `EXEC LoginSpSessionInsert @id =${req.session.user_id}`,
                      function (err, recordset) {
                        if (err) {
                          console.error(err);
                          res.status(500).send("SERVER ERROR");
                          return;
                        }
                      }
                    );
                  }
                }
              }
            );
            res.status(201).json({ user: recordset.recordset, token: token });
          } else {
            res.status(400).json("Wrong credential");
          }
        } else {
          req.app.locals.db.query(
            `EXEC RegisterCreateUser @uname ='${username}' , @pswd ='${password}' , @fname ='${first_name}' ,@lname ='${last_name}' , @email ='${email}' , @isVerified =${isVerified} , @phone='${phone}'`,
            function (err, recordset) {
              if (err) {
                console.error(err);
                res.status(500).send("SERVER ERROR");
                return;
              } else {
                    req.app.locals.db.query(
                      `EXEC LoginSpUsersSelect @email='${email}', @phone='${phone}'`,
                      async function (err, recordset) {
                        if (err) {
                          console.error(err);
                          res.status(500).send("SERVER ERROR");
                        }
                        else{
                          if (Object.keys(recordset.recordset).length !== 0) {
          
                            if (recordset.recordset[0].isVerified === true) {
                              const token = jwt.sign(
                                {
                                  user_id: recordset.recordset[0].user_id,
                                  user_name: recordset.recordset[0].username,
                                },
                                process.env.SECRET_KEY
                              );
                              req.session.user_id = recordset.recordset[0].user_id;
                              req.app.locals.db.query(
                                `EXEC LoginSpSessionSelect @id=${req.session.user_id}`,
                                function (err, recordset) {
                                  if (err) {
                                    console.error(err);
                                    res.status(500).send("SERVER ERROR");
                                    return;
                                  } else {
                                    if (Object.keys(recordset.recordset).length !== 0) {
                                      req.app.locals.db.query(
                                        `EXEC LoginSpSessionUpdate @id =${req.session.user_id}`,
                                        function (err, recordset) {
                                          if (err) {
                                            console.error(err);
                                            res.status(500).send("SERVER ERROR");
                                            return;
                                          }
                                        }
                                      );
                                    } else {
                                      req.app.locals.db.query(
                                        `EXEC LoginSpSessionInsert @id =${req.session.user_id}`,
                                        function (err, recordset) {
                                          if (err) {
                                            console.error(err);
                                            res.status(500).send("SERVER ERROR");
                                            return;
                                          }
                                        }
                                      );
                                    }
                                  }
                                }
                              );
                              res.status(201).json({ user: recordset.recordset, token: token });
                            } else {
                              res.status(400).json("Wrong credential");
                            }
                          }
                        }
                      }
                    )
                  
              }
            }
          );
        }
      }
    }
  );
});

//*---------------------------new category api using sql hierarchy------------------*\\

//all category
router.get('/getMainCategories', (req, res) => {
  req.app.locals.db.query(`select category_id, hierarchy_id.ToString() as hierarchy_id, hierarchy_id.GetLevel() as level, category_name, isDeleted from Hierarchy_Category where hierarchy_id.GetLevel()=1`, function (err, recordset) {
    if (err) {
      console.error(err)
      res.status(500).send('SERVER ERROR')
      return
    }
    res.status(200).json(recordset.recordset)
  })
})

//get subcategory of specific category and also sub categories ki bhi sub categories
router.post('/getSubCategories', (req, res) => {
  const {hierarchy_id}=req.body
  req.app.locals.db.query(`select category_id, hierarchy_id.ToString() as hierarchy_id ,hierarchy_id.GetLevel() as level, category_name, isDeleted from Hierarchy_Category where hierarchy_id.GetLevel() = (CAST('${hierarchy_id}' as hierarchyid).GetLevel()+1) and hierarchy_id.IsDescendantOf('${hierarchy_id}')=1 order by hierarchy_id asc`, function (err, recordset) {
    if (err) {
      console.error(err)
      res.status(500).send('SERVER ERROR')
      console.log("🚀  file: sqlRoutes.js:336  res", res)
      return
    }
    res.status(200).json(recordset.recordset)
  })
});

//get all products of main category
router.post('/getMainSpecificCategoryAllProducts', (req, res) => {
  const {hierarchy_id}=req.body
  req.app.locals.db.query(`select * from product inner join Hierarchy_Category on product.new_category_id=Hierarchy_Category.category_id where Hierarchy_Category.hierarchy_id.GetLevel() > 1 and Hierarchy_Category.hierarchy_id.IsDescendantOf('${hierarchy_id}')=1`, function (err, recordset) {
    if (err) {
      console.error(err)
      res.status(500).send('SERVER ERROR')
      console.log("🚀  file: sqlRoutes.js:336  res", res)
      return
    }
    res.status(200).json(recordset.recordset)
  })
})

//get specific category products
router.post('/getSpecificCategoryProducts', (req, res) => {
  const {hierarchy_id}=req.body
  req.app.locals.db.query(`select *,Hierarchy_Category.hierarchy_id.ToString() as category_string from product 
  inner join Hierarchy_Category on product.new_category_id=Hierarchy_Category.category_id 
  where hierarchy_id.GetLevel() = (CAST('${hierarchy_id}' as hierarchyid).GetLevel()) and Hierarchy_Category.hierarchy_id.IsDescendantOf('${hierarchy_id}')=1`, function (err, recordset) {
    if (err) {
      console.error(err)
      res.status(500).send('SERVER ERROR')
      console.log("🚀  file: sqlRoutes.js:336  res", res)
      return
    }
    res.status(200).json(recordset.recordset)
  })
})






module.exports = router;
