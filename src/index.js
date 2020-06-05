$('.nav-tabs a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})

$('.f-top-tools .f-tab-title i').click(function() {
  $(this).closest('div').siblings().find('i').removeClass('active');
  $(this).addClass('active');
  var contents = $(this).closest('.f-top-tools').next('.f-left-content').children('div');
  contents.removeClass('active');
  contents.eq($(this).closest('div').index()).addClass('active');
})

var json = []; // 表单配置json
var cid = 0; // 数据累加器

/**
 * 将json数据填充到textarea
 * @param {object} json json数据
 */
function setTextJSON() {
  $('.f-json-textarea').val(JSON.stringify(json, null, 4));
}

/**
 * 初始化事件
 */
(function initEvents() {
  $('.f-center form').on('click', '.form-item-tools .fa-copy', function(e) {
    e.stopPropagation()
    var type = $(this).closest('.form-item').attr('data-type');
    window['add'+type.replace(type[0],type[0].toUpperCase())]();
  })
  $('.f-center form').on('click', '.form-item-tools .fa-trash', function(e) {
    e.stopPropagation()
    removeCenterItem($(this).closest('.form-item').index());
  });
  $('.f-center form').on('click', '.form-item-tools .fa-edit', function(e) {
    e.stopPropagation()
    settingItem($(this).closest('.form-item').index());
  });
  $('.f-center form').on('click', '.form-item', function() {
    settingItem($(this).index());
  });
  var dragging, clickX, clickY, initX, initY, dragEl, itemIndex;
  $('.f-center form').on('mousedown.form-item', '.form-item', function(e) {
    dragging = true;
    dragEl = $(this);
    clickX = e.clientX;
    clickY = e.clientY;
    initX = $(this)[0].getBoundingClientRect().x;
    initY = $(this)[0].getBoundingClientRect().y;
    itemIndex = $(this).index();
    $(document).bind('mousedown.form-item', function(e) {
      if(dragging) $('body').css({cursor: 'move', 'user-select': 'none'});
    });
    $(document).bind('mousemove.form-item', function(e) {
      if(dragging && Math.abs(e.clientY - clickY) > 5) {
        dragEl.css({
          width: dragEl.width(),
          left: initX + e.clientX - clickX,
          top: initY + e.clientY - clickY,
        });
        dragEl.addClass('f-dragging');
        var displayer = $('.f-displayer').length 
          ? $('.f-displayer') 
          : $('<div class="f-displayer"></div>');
        $('.form-item').each(function() {
          if($(this)[0] != dragEl[0]) {
            var thisRect = $(this)[0].getBoundingClientRect();
            var thisTop = thisRect.y;
            var thisBottom = thisRect.y + thisRect.height;
            var dragRect = dragEl[0].getBoundingClientRect();
            var dragTop = dragRect.y;
            if(dragTop <= thisTop && dragTop >= thisTop - 20) {
              $(this).before(displayer);
            }else if(dragTop >= thisBottom && dragTop <= thisBottom + 20) {
              $(this).after(displayer);
            }
          }
        });
      }
    });
    $(document).bind('mouseup.form-item', function(e) {
      $('body').css({cursor: '', 'user-select': ''});
      if(dragging) {
        dragging = false;
        if($('.f-displayer').length) {
          var item = json.splice(itemIndex, 1)[0];
          dragEl.detach();
          json.splice($('.f-displayer').index(), 0, item);
          $('.f-displayer').after(dragEl);
          setTextJSON();
        }
        dragEl.css({
          width: '',
          left: '',
          top: '',
        });
        dragEl.removeClass('f-dragging');
        $('.f-displayer').remove();
      }
      $(document).unbind('.form-item');
    });
  });
})();

/**
 * 获取表单元素原始html
 */
function getCenterItemHtml(item) {
  var str = '';
  switch(item.type) {
    case 'text':
      str = `
        <div class="form-item" data-type="${item.type}">
          <label for="${item.id}">${item.label}</label>
          <div class="form-field">
            <input
              type="text"
              id="${item.id}"
              name="${item.name}"
              autocomplete="${item.autocomplete}"
              placeholder="${item.placeholder}"
              ${item.readonly ? 'readonly' : ''}
              ${item.disabled ? 'disabled' : ''}
              value="${item.value}">
          </div>
          <div class="form-item-tools">
            <i class="fa fa-edit"></i>
            <i class="fa fa-copy"></i>
            <i class="fa fa-trash"></i>
          </div>
        </div>`;
      break;
    case 'password':
      str = `
        <div class="form-item" data-type="${item.type}">
          <label for="${item.id}">${item.label}</label>
          <div class="form-field">
            <input
              type="password"
              id="${item.id}"
              name="${item.name}"
              autocomplete="${item.autocomplete}"
              placeholder="${item.placeholder}"
              ${item.readonly ? 'readonly' : ''}
              ${item.disabled ? 'disabled' : ''}
              value="${item.value}">
          </div>
          <div class="form-item-tools">
            <i class="fa fa-edit"></i>
            <i class="fa fa-copy"></i>
            <i class="fa fa-trash"></i>
          </div>
        </div>`;
      break;
    case 'textarea':
      str = `
        <div class="form-item" data-type="${item.type}">
          <label for="${item.id}">${item.label}</label>
          <div class="form-field">
            <textarea
              id="${item.id}"
              name="${item.name}"
              autocomplete="${item.autocomplete}"
              placeholder="${item.placeholder}"
              ${item.readonly ? 'readonly' : ''}
              ${item.disabled ? 'disabled' : ''}
              cols="${item.cols}"
              rows="${item.rows}">${item.value}</textarea>
          </div>
          <div class="form-item-tools">
            <i class="fa fa-edit"></i>
            <i class="fa fa-copy"></i>
            <i class="fa fa-trash"></i>
          </div>
        </div>`;
      break;
    case 'checkbox':
      str =`
        <div class="form-item" data-type="${item.type}">
          <label>${item.label}</label>
          <div class="form-field">`;
      item.items.forEach(function(i) {
        str += `
          <label>
            <input
              type="checkbox"
              name="${item.name}"
              id="${i.id}"
              value="${i.value}"
              title="${i.label}"
              ${i.disabled ? 'disabled' : ''}
              ${item.value.indexOf(i.value)!=-1 ? 'checked' : ''}> ${i.label}
          </label>`;
      });
      str += `</div>
          <div class="form-item-tools">
            <i class="fa fa-edit"></i>
            <i class="fa fa-copy"></i>
            <i class="fa fa-trash"></i>
          </div>
        </div>`;
      break;
    case 'radio':
      str =`
        <div class="form-item" data-type="${item.type}">
          <label>${item.label}</label>
          <div class="form-field">`;
      item.items.forEach(function(i) {
        str += `
          <label>
            <input
              type="radio"
              name="${item.name}"
              id="${i.id}"
              value="${i.value}"
              title="${i.label}"
              ${i.disabled ? 'disabled' : ''}
              ${item.value == i.value ? 'checked' : ''}> ${i.label}
          </label>`;
      });
      str += `</div>
          <div class="form-item-tools">
            <i class="fa fa-edit"></i>
            <i class="fa fa-copy"></i>
            <i class="fa fa-trash"></i>
          </div>
        </div>`;
      break;
    case 'select':
      str =`
        <div class="form-item" data-type="${item.type}">
          <label>${item.label}</label>
          <div class="form-field">
            <select
              id="${item.id}"
              name="${item.name}"
              ${item.readonly ? 'readonly' : ''}
              ${item.disabled ? 'disabled' : ''}>`;
      item.options.forEach(function(i) {
        str += `<option value="${i.value}" ${i.value==item.value ? 'selected' : ''}>${i.label}</option>`;
      });
      str += `</select>
          </div>
          <div class="form-item-tools">
            <i class="fa fa-edit"></i>
            <i class="fa fa-copy"></i>
            <i class="fa fa-trash"></i>
          </div>
        </div>`;
      break;
    case 'date':
      str = `
        <div class="form-item" data-type="${item.type}">
          <label for="${item.id}">${item.label}</label>
          <div class="form-field">
            <input
              type="text"
              id="${item.id}"
              name="${item.name}"
              autocomplete="${item.autocomplete}"
              placeholder="${item.placeholder}"
              ${item.readonly ? 'readonly' : ''}
              ${item.disabled ? 'disabled' : ''}
              value="${item.value}">
          </div>
          <div class="form-item-tools">
            <i class="fa fa-edit"></i>
            <i class="fa fa-copy"></i>
            <i class="fa fa-trash"></i>
          </div>
        </div>`;
      break;
  }
  return str;
}

/**
 * 添加表单元素
 */
function addCenterItem(item) {
  var $item = $(getCenterItemHtml(item));
  $('.f-center form').append($item);
  useUiPlugin(item, json.length-1, $item);
  setTextJSON();
}

/**
 * 移除表单元素
 * @param {number} index 
 */
function removeCenterItem(index) {
  json.splice(index, 1);
  if($('.f-center .form-item:eq('+index+')').hasClass('active')) {
    $('.f-element-setting').empty()
  }
  $('.f-center .form-item:eq('+index+')').remove();
  setTextJSON();
}

/**
 * 更新表单元素
 * @param {number} index 
 * @param {object} item 
 */
function updateCenterItem(index, item) {
  $('.f-center .form-item:eq('+index+')').html($(getCenterItemHtml(item)).html());
  useUiPlugin(item, index, $('.f-center .form-item:eq('+index+')'));
  setTextJSON();
}

/**
 * UI组件化
 */
function useUiPlugin(item, index, $item) {
  var uiPlugin = $('#f-ui-plugin').val();
  if(uiPlugin == 'layui') {
    $('.f-center form').addClass('layui-form')
      .find('.form-item').addClass('layui-form-item').end()
      .find('.form-item > label').addClass('layui-form-label').end()
      .find('.form-field').addClass('layui-input-block').end()
    if(item.type == 'text') {
      $item.find('input[type=text]').addClass('layui-input').on('keyup', function() {
        json[index].value = this.value;
        setTextJSON();
        settingItem(index);
      });
    }else if(item.type == 'password') {
      $item.find('input[type=password]').addClass('layui-input').on('keyup', function() {
        json[index].value = this.value;
        setTextJSON();
        settingItem(index);
      });
    }else if(item.type == 'textarea') {
      $item.find('textarea').addClass('layui-textarea').on('keyup', function() {
        json[index].value = this.value;
        setTextJSON();
        settingItem(index);
      });
    }else if(item.type == 'checkbox') {
      $item.find('input[type=checkbox]').each(function() {
        if($(this).parent('label').length) {
          $(this).parent('label').after($('<span>').html($(this))).remove();
        }
      });
      layui.form.on('checkbox', function(data){
        var value = []
        $(data.elem).closest('.form-item').find('input[type=checkbox]').each(function() {
          if($(this).prop('checked')) {
            value.push($(this).val());
          }
        });
        json[$(data.elem).closest('.form-item').index()].value = value;
        setTextJSON();
        settingItem(index);
      });
    }else if(item.type == 'radio') {
      $item.find('input[type=radio]').each(function() {
        if($(this).parent('label').length) {
          $(this).parent('label').after($('<span>').html($(this))).remove();
        }
      });
      layui.form.on('radio', function(data){
        var value = '';
        $(data.elem).closest('.form-item').find('input[type=radio]').each(function() {
          if($(this).prop('checked')) {
            value = $(this).val();
          }
        });
        json[index].value = value;
        setTextJSON();
        settingItem(index);
      });
    }else if(item.type == 'select') {
      layui.form.on('select', function(data){
        json[index].value = data.value;
        setTextJSON();
        settingItem(index);
      });
    }else if(item.type == 'date') {
      layui.laydate.render({
        elem: $item.find('input[type=text]')[0],
        trigger: 'click',
        done: function(){
          json[index].value = $item.find('input[type=text]')[0].value;
          setTextJSON();
          settingItem(index);
        }
      });
      $item.find('input[type=text]').addClass('layui-input').on('keyup', function() {
        json[index].value = this.value;
        setTextJSON();
        settingItem(index);
      });
    }
    layui.form.render();
  }
}

/**
 * 重绘
 */
function reRender() {
  $('.f-element-setting').empty();
  $('.f-center form').empty();
  json.forEach(function(item) {
    addCenterItem(item);
  });
  setTextJSON();
}

/**
 * 生成表单元素设置区域
 */
function settingItem(index) {
  $('.form-item').removeClass('active');
  $('.form-item').eq(index).addClass('active');
  var item = json[index];
  var str = '';
  function itemHTML(label, content) {
    return `
      <div class="f-label-field">
        <label>${label}</label>
        ${content}
      </div>
    `;
  }
  switch(item.type) {
    case 'text':
      str += itemHTML('Label', `<input class="f-input" id="f-es-label" value="${item.label}">`);
      str += itemHTML('ID', `<input class="f-input" id="f-es-id" value="${item.id}">`);
      str += itemHTML('Name', `<input class="f-input" id="f-es-name" value="${item.name}">`);
      str += itemHTML('Placeholder', `<input class="f-input" id="f-es-placeholder" value="${item.placeholder}">`);
      str += itemHTML('Autocomplete', `<input class="f-input" id="f-es-autocomplete" value="${item.autocomplete}">`);
      str += itemHTML('Readonly', `<div id="f-es-readonly" class="f-switch ${item.readonly?'on':''}"><i></i></div>`);
      str += itemHTML('Disabled', `<div id="f-es-disabled" class="f-switch ${item.disabled?'on':''}"><i></i></div>`);
      str += itemHTML('Value', `<input class="f-input" id="f-es-value" value="${item.value}">`);
      break;
    case 'password':
      str += itemHTML('Label', `<input class="f-input" id="f-es-label" value="${item.label}">`);
      str += itemHTML('ID', `<input class="f-input" id="f-es-id" value="${item.id}">`);
      str += itemHTML('Name', `<input class="f-input" id="f-es-name" value="${item.name}">`);
      str += itemHTML('Placeholder', `<input class="f-input" id="f-es-placeholder" value="${item.placeholder}">`);
      str += itemHTML('Autocomplete', `<input class="f-input" id="f-es-autocomplete" value="${item.autocomplete}">`);
      str += itemHTML('Readonly', `<div id="f-es-readonly" class="f-switch ${item.readonly?'on':''}"><i></i></div>`);
      str += itemHTML('Disabled', `<div id="f-es-disabled" class="f-switch ${item.disabled?'on':''}"><i></i></div>`);
      str += itemHTML('Value', `<input class="f-input" id="f-es-value" value="${item.value}">`);
      break;
    case 'textarea':
      str += itemHTML('Label', `<input class="f-input" id="f-es-label" value="${item.label}">`);
      str += itemHTML('ID', `<input class="f-input" id="f-es-id" value="${item.id}">`);
      str += itemHTML('Name', `<input class="f-input" id="f-es-name" value="${item.name}">`);
      str += itemHTML('Placeholder', `<input class="f-input" id="f-es-placeholder" value="${item.placeholder}">`);
      str += itemHTML('Autocomplete', `<input class="f-input" id="f-es-autocomplete" value="${item.autocomplete}">`);
      str += itemHTML('Readonly', `<div id="f-es-readonly" class="f-switch ${item.readonly?'on':''}"><i></i></div>`);
      str += itemHTML('Disabled', `<div id="f-es-disabled" class="f-switch ${item.disabled?'on':''}"><i></i></div>`);
      str += itemHTML('Cols', `<input class="f-input" id="f-es-cols" value="${item.cols}">`);
      str += itemHTML('Rows', `<input class="f-input" id="f-es-rows" value="${item.rows}">`);
      str += itemHTML('Value', `<input class="f-input" id="f-es-value" value="${item.value}">`);
      break;
    case 'checkbox':
      var items = '';
      item.items.forEach(function(it, i) {
        items += `
          <div class="f-group">
            ${i!=0 ? '<i class="fa fa-trash"></i>' : ''}
            <div class="f-label-field">
              <label>ID</label>
              <input class="f-input f-es-items-id" value="${it.id}">
            </div>
            <div class="f-label-field">
              <label>Disalbed</label>
              <div class="f-switch ${it.disabled?'on':''} f-es-items-disabled"><i></i></div>
            </div>
            <div class="f-label-field">
              <label>Value</label>
              <input class="f-input f-es-items-value" value="${it.value}">
            </div>
            <div class="f-label-field">
              <label>Label</label>
              <input class="f-input f-es-items-label" value="${it.label}">
            </div>
          </div>
        `;
      });
      str += itemHTML('Label', `<input class="f-input" id="f-es-label" value="${item.label}">`);
      str += itemHTML('Name', `<input class="f-input" id="f-es-name" value="${item.name}">`);
      str += itemHTML('Value', `<input class="f-input" id="f-es-checkbox-value" value="${item.value}">`);
      str += itemHTML('Items', `<div>${items}<i class="fa fa-plus f-group-plus"></i></div>`);
      break;
    case 'radio':
      var items = '';
      item.items.forEach(function(it, i) {
        items += `
          <div class="f-group">
            ${i!=0 ? '<i class="fa fa-trash"></i>' : ''}
            <div class="f-label-field">
              <label>ID</label>
              <input class="f-input f-es-items-id" value="${it.id}">
            </div>
            <div class="f-label-field">
              <label>Disalbed</label>
              <div class="f-switch ${it.disabled?'on':''} f-es-items-disabled"><i></i></div>
            </div>
            <div class="f-label-field">
              <label>Value</label>
              <input class="f-input f-es-items-value" value="${it.value}">
            </div>
            <div class="f-label-field">
              <label>Label</label>
              <input class="f-input f-es-items-label" value="${it.label}">
            </div>
          </div>
        `;
      });
      str += itemHTML('Label', `<input class="f-input" id="f-es-label" value="${item.label}">`);
      str += itemHTML('Name', `<input class="f-input" id="f-es-name" value="${item.name}">`);
      str += itemHTML('Value', `<input class="f-input" id="f-es-value" value="${item.value}">`);
      str += itemHTML('Items', `<div>${items}<i class="fa fa-plus f-group-plus"></i></div>`);
      break;
    case 'select':
      var options = '';
      item.options.forEach(function(it, i) {
        options += `
          <div class="f-group">
            ${i!=0 ? '<i class="fa fa-trash"></i>' : ''}
            <div class="f-label-field">
              <label>Value</label>
              <input class="f-input f-es-options-value" value="${it.value}">
            </div>
            <div class="f-label-field">
              <label>Label</label>
              <input class="f-input f-es-options-label" value="${it.label}">
            </div>
          </div>
        `;
      });
      str += itemHTML('Label', `<input class="f-input" id="f-es-label" value="${item.label}">`);
      str += itemHTML('Name', `<input class="f-input" id="f-es-name" value="${item.name}">`);
      str += itemHTML('ID', `<input class="f-input" id="f-es-id" value="${item.id}">`);
      str += itemHTML('Readonly', `<div id="f-es-readonly" class="f-switch ${item.readonly?'on':''}"><i></i></div>`);
      str += itemHTML('Disabled', `<div id="f-es-disabled" class="f-switch ${item.disabled?'on':''}"><i></i></div>`);
      str += itemHTML('Value', `<input class="f-input" id="f-es-value" value="${item.value}">`);
      str += itemHTML('Options', `<div>${options}<i class="fa fa-plus f-group-plus"></i></div>`);
      break;
    case 'date':
      str += itemHTML('Label', `<input class="f-input" id="f-es-label" value="${item.label}">`);
      str += itemHTML('ID', `<input class="f-input" id="f-es-id" value="${item.id}">`);
      str += itemHTML('Name', `<input class="f-input" id="f-es-name" value="${item.name}">`);
      str += itemHTML('Placeholder', `<input class="f-input" id="f-es-placeholder" value="${item.placeholder}">`);
      str += itemHTML('Autocomplete', `<input class="f-input" id="f-es-autocomplete" value="${item.autocomplete}">`);
      str += itemHTML('Readonly', `<div id="f-es-readonly" class="f-switch ${item.readonly?'on':''}"><i></i></div>`);
      str += itemHTML('Disabled', `<div id="f-es-disabled" class="f-switch ${item.disabled?'on':''}"><i></i></div>`);
      str += itemHTML('Value', `<input class="f-input" id="f-es-value" value="${item.value}">`);
      break;
    default:
      str = '';
  }
  $('.f-element-setting').html(str);
  $('#f-es-label').on('keyup', function() {
    json[index].label = this.value;
    updateCenterItem(index, json[index])
  })
  $('#f-es-name').on('keyup', function() {
    json[index].name = this.value;
    updateCenterItem(index, json[index])
  })
  $('#f-es-id').on('keyup', function() {
    json[index].id = this.value;
    updateCenterItem(index, json[index])
  })
  $('#f-es-placeholder').on('keyup', function() {
    json[index].placeholder = this.value;
    updateCenterItem(index, json[index])
  })
  $('#f-es-autocomplete').on('keyup', function() {
    json[index].autocomplete = this.value;
    updateCenterItem(index, json[index])
  })
  $('#f-es-value').on('keyup', function() {
    json[index].value = this.value;
    updateCenterItem(index, json[index])
  })
  $('#f-es-cols').on('keyup', function() {
    json[index].cols = this.value;
    updateCenterItem(index, json[index])
  })
  $('#f-es-rows').on('keyup', function() {
    json[index].rows = this.value;
    updateCenterItem(index, json[index])
  })
  $('#f-es-readonly').click(function() {
    json[index].readonly = !$(this).hasClass('on');
    updateCenterItem(index, json[index])
  });
  $('#f-es-disabled').click(function() {
    json[index].disabled = !$(this).hasClass('on');
    updateCenterItem(index, json[index])
  });
  $('.f-es-items-id').on('keyup', function() {
    json[index].items[$(this).closest('.f-group').index()].id = this.value;
    updateCenterItem(index, json[index])
  });
  $('.f-es-items-disabled').on('click', function() {
    json[index].items[$(this).closest('.f-group').index()].disabled = !$(this).hasClass('on');
    updateCenterItem(index, json[index])
  });
  $('.f-es-items-value').on('keyup', function() {
    json[index].items[$(this).closest('.f-group').index()].value = this.value;
    updateCenterItem(index, json[index])
  });
  $('.f-es-items-label').on('keyup', function() {
    json[index].items[$(this).closest('.f-group').index()].label = this.value;
    updateCenterItem(index, json[index])
  });
  $('.f-es-options-value').on('keyup', function() {
    json[index].options[$(this).closest('.f-group').index()].value = this.value;
    updateCenterItem(index, json[index])
  });
  $('.f-es-options-label').on('keyup', function() {
    json[index].options[$(this).closest('.f-group').index()].label = this.value;
    updateCenterItem(index, json[index])
  });
  $('#f-es-checkbox-value').on('keyup', function() {
    json[index].value = this.value.split(',')
    updateCenterItem(index, json[index])
  })
  $('.f-group-plus').on('click', function() {
    var its = (json[index].items || json[index].options);
    var it = {};
    var last = its[its.length-1];
    if(last) {
      for(var key in last) {
        if(typeof last[key] == 'string') {
          var strs = last[key].split('-');
          if(strs.length == 3) {
            it[key] = strs[0] + '-' + strs[1] + '-' + (Number(strs[2])+1)
          }else {
            it[key] = Number(last[key]) + 1 + ''
          }
        }else if(typeof last[key] == 'boolean') {
          it[key] = false
        }
      }
    }
    its.push(it);
    updateCenterItem(index, json[index])
    $('.form-item:eq('+index+')').click()
  });
  $('.f-group .fa-trash').on('click', function() {
    var its = (json[index].items || json[index].options);
    its.splice($(this).closest('.f-group').index(), 1);
    updateCenterItem(index, json[index]);
    $('.form-item:eq('+index+')').click();
  });
  
  $('.f-switch').click(function() {
    $(this).toggleClass('on');
  });
}

function updateJson() {
  var jsonStr = $('.f-json-textarea').val();
  try {
    json = JSON.parse(jsonStr);
  }catch(e) {
    alert('格式错误')
    return;
  }
  if(json.constructor == Array) {
    reRender()
  }else {
    alert('格式错误')
  }
}

/**
 * 增加输入框
 */
function addText() {
  cid++;
  json.push({
    type: 'text',
    label: '输入框',
    id: 'text'+'-'+cid,
    name: 'text'+'-'+cid,
    placeholder: '请输入',
    autocomplete: 'off',
    readonly: false,
    disabled: false,
    value: ''
  });
  addCenterItem(json[json.length-1]);
}

/**
 * 增加密码框
 */
function addPassword() {
  cid++;
  json.push({
    type: 'password',
    label: '密码框',
    id: 'password'+'-'+cid,
    name: 'password'+'-'+cid,
    placeholder: '请输入密码',
    autocomplete: 'off',
    readonly: false,
    disabled: false,
    value: ''
  });
  addCenterItem(json[json.length-1]);
}

/**
 * 增加文本框
 */
function addTextarea() {
  cid++;
  json.push({
    type: 'textarea',
    label: '文本框',
    id: 'textarea'+'-'+cid,
    name: 'textarea'+'-'+cid,
    placeholder: '请输入文本',
    autocomplete: 'off',
    readonly: false,
    disabled: false,
    cols: 10,
    rows: 2,
    value: ''
  });
  addCenterItem(json[json.length-1]);
}

/**
 * 增加多选框
 */
function addCheckbox() {
  cid++;
  json.push({
    type: 'checkbox',
    label: '多选框',
    name: 'checkbox'+'-'+cid,
    items: [{
      id: 'checkbox'+'-'+cid+'-'+1,
      disabled: false,
      value: '1',
      label: '1'
    },{
      id: 'checkbox'+'-'+cid+'-'+2,
      disabled: false,
      value: '2',
      label: '2'
    },{
      id: 'checkbox'+'-'+cid+'-'+3,
      disabled: false,
      value: '3',
      label: '3'
    }],
    value: []
  });
  addCenterItem(json[json.length-1]);
}

/**
 * 增加单选框
 */
function addRadio() {
  cid++;
  json.push({
    type: 'radio',
    label: '单选框',
    name: 'radio'+'-'+cid,
    items: [{
      id: 'radio'+'-'+cid+'-'+1,
      disabled: false,
      value: '1',
      label: '1'
    },{
      id: 'radio'+'-'+cid+'-'+2,
      disabled: false,
      value: '2',
      label: '2'
    }],
    value: ''
  });
  addCenterItem(json[json.length-1]);
}

/**
 * 增加下拉框
 */
function addSelect() {
  cid++;
  json.push({
    type: 'select',
    label: '下拉框',
    id: 'select'+'-'+cid,
    name: 'select'+'-'+cid,
    readonly: false,
    disabled: false,
    value: '',
    options: [{
      value: 'select'+'-'+cid+'-'+1,
      label: 'select'+'-'+cid+'-'+1
    }, {
      value: 'select'+'-'+cid+'-'+2,
      label: 'select'+'-'+cid+'-'+2
    }, {
      value: 'select'+'-'+cid+'-'+3,
      label: 'select'+'-'+cid+'-'+3
    }]
  });
  addCenterItem(json[json.length-1]);
}

/**
 * 增加日期框
 */
function addDate() {
  cid++;
  json.push({
    type: 'date',
    label: '日期框',
    id: 'date'+'-'+cid,
    name: 'date'+'-'+cid,
    placeholder: 'yyyy-MM-dd',
    autocomplete: 'off',
    readonly: false,
    disabled: false,
    value: ''
  });
  addCenterItem(json[json.length-1]);
}

/**
 * 查看生成的表单html
 */
function viewHtml() {
  var $form = $('<form>');
  json.forEach(function(item) {
    $form.append(getCenterItemHtml(item))
  });
  var uiPlugin = $('#f-ui-plugin').val();
  if(uiPlugin == 'layui') {
    $form.addClass('layui-form')
      .find('.form-item').addClass('layui-form-item').end()
      .find('.form-item > label').addClass('layui-form-label').end()
      .find('.form-field').addClass('layui-input-block').end()
      .find('input[type=text]').addClass('layui-input').end()
      .find('input[type=password]').addClass('layui-input').end()
      .find('textarea').addClass('layui-textarea').end()
      .find('input[type=checkbox]').each(function() {
        if($(this).parent('label').length) {
          $(this).parent('label').after($('<span>').html($(this))).remove();
        }
      }).end()
      .find('input[type=radio]').each(function() {
        if($(this).parent('label').length) {
          $(this).parent('label').after($('<span>').html($(this))).remove();
        }
      }).end()
      .find('.form-item-tools').remove();
  }
  var html = $form.html();
  $('.f-modal').show().find('textarea').val(html);
  $('.f-modal-content').hide().slideDown();
}
function copyHtml() {
  $('.f-modal textarea').select();
  document.execCommand("Copy");
}
$('.f-modal').click(function() {
  $('.f-modal-content').slideUp(function() {
    $('.f-modal').hide();
  });
});
$('.f-modal-content').click(function(e) {
  e.stopPropagation()
});

