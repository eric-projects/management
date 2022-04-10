<template>
  <div>
    <a-form :layout="layout" :form="form"><slot></slot></a-form>
  </div>
</template>

<script>
import { formHelper, guidHelper, notificationHelper } from '@/common/utils';
import { from } from 'rxjs';
export default {
  props: {
    layout: { type: String, default: 'horizontal' },
  },
  data() {
    return { form: undefined };
  },
  created() {
    this.resetFormId();
  },
  methods: {
    validate() {
      return from(
        new Promise((resolve, reject) => {
          const msgs = formHelper.validateForm(this.form);
          if (msgs.length > 0) {
            notificationHelper.error(msgs);
            reject();
          } else {
            resolve();
          }
        })
      );
    },
    resetFormId() {
      this.form = this.$form.createForm(this, { name: guidHelper.generate() });
    },
  },
};
</script>

<style></style>
