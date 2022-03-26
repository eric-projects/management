<template>
  <div>
    <a-row :gutter="8">
      <a-col :span="12">
        <a-card title="随机 Guid">
          <a slot="extra" href="#" @click="createGuid">生成</a>
          <p>{{ randomGuid }}</p>
        </a-card></a-col
      >
      <a-col :span="12">
        <a-card title="jwt">
          <div slot="extra">
            <a class="ml-2" href="#" @click="jwtEncryption">加密</a>
            <a class="ml-2" href="#" @click="jwtDecrypt">解密</a>
          </div>
          <p>key：<a-input style="width:300px" v-model="jwtKey" placeholder="加密/解码 key"></a-input></p>
          <p>数据：<a-input style="width:300px" v-model="jwtData" placeholder="加密/解码数据"></a-input></p>
          <p>时校：<a-input-number style="width:300px" v-model="jwtHour" :min="0" placeholder="加密数据时校" />秒</p>
          <p>
            结果：<a-switch checked-children="校验时校" un-checked-children="忽略时校" default-checked v-model="jwtCheck" /><br />
            <a-textarea class="mt-1" placeholder="结果" :rows="4" :value="jwtResult || jwtError" />
          </p> </a-card
      ></a-col>
    </a-row>
  </div>
</template>

<script>
import jwt from 'jsonwebtoken';
export default {
  data() {
    return { randomGuid: '', jwtResult: '', jwtKey: '', jwtData: '', jwtHour: '', jwtError: '', jwtCheck: true };
  },
  created() {
    this.createGuid();
  },
  methods: {
    /**
     * 创建guid
     */
    createGuid() {
      var s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      };
      this.randomGuid = `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
    },
    /**
     * jwt 加密
     */
    jwtEncryption() {
      this.jwtResult = '';
      var option = {};
      if (this.jwtHour) {
        option.expiresIn = this.jwtHour;
      }
      this.jwtResult = jwt.sign({ data: this.jwtData }, this.jwtKey, option);
    },
    /**
     * jwt解密
     */
    jwtDecrypt() {
      this.jwtResult = '';
      var option = {};
      if (!this.jwtCheck) {
        option.ignoreExpiration = true;
      }
      // ignoreExpiration 忽略过期
      try {
        jwt.verify(this.jwtData, this.jwtKey, option, (err, res) => {
          if (err) {
            this.jwtError = err.message;
          } else if (res) {
            this.jwtResult = res.data || res.nameid;
          }
          // this.jwtError = err.message;
        });
      } catch (error) {
        this.jwtResult = error;
      }
    },
  },
};
</script>

<style></style>
