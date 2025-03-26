<template>
  <div class="date-picker-container">
    <el-button 
      type="primary" 
      size="small" 
      @click="dialogVisible = true"
      icon="el-icon-date"
      class="date-picker-button"
    >
      选择时间范围
    </el-button>

    <el-dialog
      title="编辑日期范围"
      :visible.sync="dialogVisible"
      width="1100px"
      :modal="true"
      :close-on-click-modal="true"
      custom-class="date-picker-dialog"
      :append-to-body="true"
    >
      <div class="dialog-subtitle">选择地表异常观测日期的范围</div>
      
      <div class="calendars-container">
        <div class="calendar-section">
          <div class="date-input-group">
            <div class="date-label">开始日期 </div>
            <el-input v-model="formattedStartDate" readonly size="medium" class="date-input">
              <template slot="suffix">
                <i class="el-icon-close" @click="clearStartDate"></i>
              </template>
            </el-input>
          </div>
          <div class="calendar-wrapper">
            <el-calendar v-model="startDate">
              <template slot="dateCell" slot-scope="{date, data}">
                <div :class="getCellClass(date)">
                  {{ data.day.split('-').slice(-1)[0] }}
                </div>
              </template>
            </el-calendar>
          </div>
        </div>

        <div class="calendar-section">
          <div class="date-input-group">
            <div class="date-label">结束日期 </div>
            <el-input v-model="formattedEndDate" readonly size="medium" class="date-input">
              <template slot="suffix">
                <i class="el-icon-close" @click="clearEndDate"></i>
              </template>
            </el-input>
          </div>
          <div class="calendar-wrapper">
            <el-calendar v-model="endDate">
              <template slot="dateCell" slot-scope="{date, data}">
                <div :class="getCellClass(date)">
                  {{ data.day.split('-').slice(-1)[0] }}
                </div>
              </template>
            </el-calendar>
          </div>
        </div>
      </div>

      <div class="selected-range" v-if="startDate && endDate">
        <span class="range-text">已选择：{{ formattedStartDate }} 至 {{ formattedEndDate }}</span>
        <i class="el-icon-close" @click="clearDates"></i>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirmDateRange">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { handleDateChange } from './sdl';

export default {
  data() {
    return {
      dialogVisible: false,
      startDate: new Date('2024-11-01'),
      endDate: new Date('2024-12-12'),
    };
  },
  computed: {
    formattedStartDate() {
      return this.formatDate(this.startDate);
    },
    formattedEndDate() {
      return this.formatDate(this.endDate);
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return '';
      return date.toISOString().split('T')[0];
    },
    getCellClass(date) {
      const cellDate = new Date(date);
      const classes = ['calendar-cell'];
      
      if (this.startDate && this.endDate) {
        if (cellDate >= this.startDate && cellDate <= this.endDate) {
          classes.push('in-range');
        }
        if (cellDate.toDateString() === this.startDate.toDateString()) {
          classes.push('start-date');
        }
        if (cellDate.toDateString() === this.endDate.toDateString()) {
          classes.push('end-date');
        }
      }
      
      return classes.join(' ');
    },
    clearStartDate() {
      this.startDate = null;
    },
    clearEndDate() {
      this.endDate = null;
    },
    clearDates() {
      this.startDate = null;
      this.endDate = null;
    },
    async confirmDateRange() {
      if (!this.startDate || !this.endDate) {
        this.$message.warning('请选择完整的日期范围');
        return;
      }

      // 转换为时间戳进行比较
      const startTimestamp = new Date(this.startDate).getTime();
      const endTimestamp = new Date(this.endDate).getTime();
      
      if (endTimestamp < startTimestamp) {
        this.$message.warning('结束日期不能早于开始日期，请重新选择');
        return;
      }
      
      const dates = {
        起始日: this.formattedStartDate,
        截止日: this.formattedEndDate
      };
      
      try {
        await handleDateChange(dates);
        this.$emit('reload-layer');
        this.dialogVisible = false;
      } catch (error) {
        console.error('更新日期失败:', error);
      }
    }
  }
};
</script>

<style scoped>

.date-picker-container {
  position: absolute;
  bottom: 7px;
  left: 100px;
  z-index: 2;
}

:deep(.date-picker-dialog) {
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  background: #fff;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding: 12px 16px;
  background: #f8f9fb;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
}

:deep(.el-dialog__headerbtn) {
  top: 18px;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #909399;
}

:deep(.el-dialog__body) {
  padding: 8px;
}

:deep(.el-dialog__footer) {
  padding: 8px 12px;
  background: #f8f9fb;
  border-top: 1px solid #ebeef5;
  text-align: right;
}

.dialog-subtitle {
  font-size: 15px;
  color: #909399;
  margin-bottom: 12px;
}

.calendars-container {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.calendar-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
/* 日历框 */
.calendar-wrapper {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 0px;
  background: #ffffff;
  height: 100%;
  max-height: 400px;
  overflow-y: auto;
}

:deep(.el-calendar) {
  background: none;
  border: none;
  max-height: 400px;
  overflow-y: auto;
}

:deep(.el-calendar__header) {
  padding: 0 0 8px 0;
  margin: 0;
  min-height: auto;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-calendar__title) {
  font-size: 13px;
  color: #606266;
  font-weight: normal;
}

:deep(.el-calendar__body) {
  padding: 0;
  height: 100px;
}

:deep(.el-calendar-table) {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  table-layout: fixed;
}

:deep(.el-calendar-table td) {
  border: none;
  padding: 0;
  position: relative;
  aspect-ratio: 1;
  width: calc(100% / 7);
}

:deep(.el-calendar-table th) {
  padding: 0;
  height: 24px;
  font-size: 12px;
  color: #909399;
  font-weight: normal;
}

:deep(.el-calendar-table .el-calendar-day) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* 单元格样式 */
.calendar-cell {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border-radius: 30px;
  transition: all 0.5s ease;
}

.calendar-cell:hover {
  color: #409EFF;
}

.calendar-cell.in-range {
  background-color: #ecf5ff;
  color: #409EFF;
}

.calendar-cell.start-date,
.calendar-cell.end-date {
  background-color: #409EFF;
  color: white;
}

.calendar-cell.start-date {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.calendar-cell.end-date {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.selected-range {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f0f9ff;
  color: #409EFF;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 15px;
  margin-top: 8px;
  border: 1px solid #e1f3ff;
}

:deep(.el-button--primary) {
  padding: 8px 16px;
  font-size: 13px;
  border-radius: 4px;
}

:deep(.el-button--primary:hover) {
  opacity: 0.9;
}

:deep(.date-picker-button) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 4px;
}

.date-label {
  color: #606266;
  font-size: 16px;
}

.date-input {
  width: 100%;
}

:deep(.date-input .el-input__inner) {
  height: 32px;
  line-height: 32px;
  font-size: 13px;
  border-radius: 4px;
  transition: all 0.2s;
  padding: 0 8px;
  background: #f8f9fb;
  border: 1px solid #e4e7ed;
}

:deep(.date-input .el-input__inner:hover) {
  border-color: #c0c4cc;
}

:deep(.date-input .el-input__inner:focus) {
  border-color: #409EFF;
  background: #fff;
}

:deep(.el-input__suffix) {
  right: 8px;
}

:deep(.el-icon-close) {
  color: #c0c4cc;
  cursor: pointer;
  transition: color 0.2s;
}

:deep(.el-icon-close:hover) {
  color: #909399;
}
</style>
