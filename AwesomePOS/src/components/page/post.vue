<template>
  <div class="post">
    <el-row>
      <el-col :span='7' class='pos-order' id='orbder-list'>
        <el-tabs>
          <el-tab-pane label='点餐'>
            <el-table :data='tableData' border width='100%'>
              <el-table-column prop='goodsName' label='商品名称'></el-table-column>
              <el-table-column prop='count' label='数量' width='50'></el-table-column>
              <el-table-column prop='price' label='金额' width='70'></el-table-column>
              <el-table-column label='操作' width='100' fixed='right'>
                <template scope='scope'>
                  <el-button type='text' size='small ' @click='delSingleGoods(scope.row)'>删除</el-button>
                  <el-button type='text' size='small ' @click='addOrderList(scope.row)'>增加</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="total-box">
              数量：{{totalCount}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金额：{{totalMoney}}
            </div>
            <div class='div-btn'>
              <el-button type='warning'>挂单</el-button>
              <el-button type='danger' @click = "delAllGoods()">删除</el-button>
              <el-button type='success' @click = "checkOut()">结账</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label='挂单'>
            挂单
          </el-tab-pane>
          <el-tab-pane label='外卖'>
            外卖
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span='17'>
        <div class="often-goods">
          <div class="title">常用商品</div>
          <div class="often-goods-list">
            <ul>
              <li v-for="item in oftenGoods" @click='addOrderList(item)'>
                <span>{{item.goodsName}}</span>
                <span class="o-price">￥{{item.price}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="goods-type">
          <el-tabs>
            <el-tab-pane label="汉堡">
              <ul class="cookList">
                <li v-for='item in type0Goods' @click='addOrderList(item)'>
                  <span class="foodImg"><img :src="item.goodsImg" width="100%"></span>
                  <p class="foodName">{{item.goodsName}}</p>
                  <p class="foodPrice">￥{{item.price}}</p>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="小食">
              <ul class="cookList">
                <li v-for='item in type1Goods' @click='addOrderList(item)'>
                  <span class="foodImg"><img :src="item.goodsImg" width="100%"></span>
                  <p class="foodName">{{item.goodsName}}</p>
                  <p class="foodPrice">￥{{item.price}}</p>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="饮料">
              <ul class="cookList">
                <li v-for='item in type2Goods' @click='addOrderList(item)'>
                  <span class="foodImg"><img :src="item.goodsImg" width="100%"></span>
                  <p class="foodName">{{item.goodsName}}</p>
                  <p class="foodPrice">￥{{item.price}}</p>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="套餐">
              <ul class="cookList">
                <li v-for='item in type3Goods' @click='addOrderList(item)'>
                  <span class="foodImg"><img :src="item.goodsImg" width="100%"></span>
                  <p class="foodName">{{item.goodsName}}</p>
                  <p class="foodPrice">￥{{item.price}}</p>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'post',
  data() {
    return {
      tableData: [],
      oftenGoods: [],
      type0Goods: [],
      type1Goods: [],
      type2Goods: [],
      type3Goods: [],
      type4Goods: [],
      totalMoney: 0,
      totalCount: 0
    }
  },
  created() {
    axios.get("http://jspang.com/DemoApi/oftenGoods.php")
      .then(reponse => {
        this.oftenGoods = reponse.data;
      }).catch(error => {
        alert("网络错误、不能访问")
      })

    axios.get("http://jspang.com/DemoApi/typeGoods.php")
      .then(reponse => {
        this.type0Goods = reponse.data[0]
        this.type1Goods = reponse.data[1]
        this.type2Goods = reponse.data[2]
        this.type3Goods = reponse.data[3]
      }).catch(error => {
        alert("网络错误、不能访问")
      })
  },
  mounted() {
    let orderHeight = document.body.clientHeight;
    document.querySelector("#orbder-list").style.height = orderHeight + "px";
  },
  methods: {
    // 增加单个商品
    addOrderList(data) {
      // 商品已经存在与订单列表中
      let isHave = false;
      this.tableData.forEach((item) => {
        if (item.goodsId == data.goodsId) {
          isHave = true;
        }
      })
      // 根据判断的值编写业务逻辑
      if (isHave) {
        // 改变列表中商品的数量
        let arr = this.tableData.filter(o => o.goodsId == data.goodsId);
        arr[0].count++;
      } else {
        let newGoods = {
          goodsId: data.goodsId,
          goodsName: data.goodsName,
          price: data.price,
          count: 1
        };
        this.tableData.push(newGoods);
      }
      this.getAllMoney();
    },
    // 删除单个商品
    delSingleGoods(data) {
      this.tableData = this.tableData.filter(o => o.goodsId != data.goodsId);
      this.getAllMoney();
    },
    // 汇总数量和金额
    getAllMoney() {

      this.totalMoney = 0;
      this.totalCount = 0;

      if (this.tableData) {
        // 计算合计
        this.tableData.forEach((item) => {
          this.totalCount += item.count;
          this.totalMoney = this.totalMoney + (item.price * item.count);
        })
      }
    },
    // 全部删除
    delAllGoods(){
      this.tableData = [];
      this.totalMoney = 0;
      this.totalCount = 0;
    },
    // 模拟结账
    checkOut(){
      if(this.totalCount != 0 ){
          // console.log(this.tableData)
          this.tableData = [];
          this.totalMoney = 0;
          this.totalCount = 0;

          this.$message({
            message:"结账成功，感谢为您服务！",
            type: 'success'
          })
      }else{
        console.dir(this.$message)
        // this.$message({
        //     message:"请选择商品哦~",
        //     type: 'warning'
        //   })
        this.$message.warning("请选择商品哦")
      }
    }
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pos-order {
  background: #e9dfdf;
  border: 1px solid #d19d9d;
  height: 100%;
}

.div-btn {
  margin-top: 10px;
}

.title {
  height: 20px;
  border-bottom: 1px solid #d19d9d;
  background-color: #f9fafc;
  padding: 10px;
  text-align: left;
}

.often-goods-list ul {
  overflow: hidden;
}

.often-goods-list ul li {
  list-style: none;
  float: left;
  border: 1px solid #f9fafc;
  padding: 10px;
  margin: 10px;
  background: #fff;
  cursor: pointer;
}

.o-price {
  color: #2ab0b0;
}

.cookList li {
  list-style: none;
  width: 23%;
  border: 1px solid #E5E9F2;
  height: auot;
  overflow: hidden;
  background-color: #fff;
  padding: 2px;
  float: left;
  margin: 2px;
  cursor: pointer;
}

.cookList li span {
  display: block;
  float: left;
}

.foodImg {
  width: 40%;
}

.foodName {
  font-size: 18px;
  padding-left: 10px;
  color: brown;
}

.foodPrice {
  font-size: 16px;
  padding-left: 10px;
  padding-top: 10px;
}

.total-box {
  background-color: #f0aaaa;
  padding: 10px;
  color: #fff;
  border-bottom: 1px solid #E5E9F2;
}

</style>
