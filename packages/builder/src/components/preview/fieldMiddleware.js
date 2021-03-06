import React from 'react'
import cls from 'classnames'
import { registerFieldMiddleware } from '../../utils/baseForm'

export default (FormConsumer, that) => {
  const hasRegisted = window.__hasRegisted__ || false
  if (hasRegisted) {
    return false
  }
  const { UI } = that.props
  window.__hasRegisted__ = true
  registerFieldMiddleware(Field => props =>
    React.createElement(FormConsumer, {}, (obj = {}) => {
      const { type } = obj
      if (props.path.length === 0 || type !== 'preview') {
        return React.createElement(Field, props)
      }
      const { title = '', active = false } = props.schema
      const id = props.path[0]
      const comp = {
        id,
        ...props.schema
      }
      const isLayoutWrapper =
        comp['x-props'] &&
        comp['x-props']._extra &&
        comp['x-props']._extra.__key__ === 'layout'
      const layoutDragProps = isLayoutWrapper
        ? {
          onDragOver: ev => that.onDragOver(ev, 'layout'),
          onDragLeave: ev => that.onDragLeave(ev, 'layout'),
          onDrop: ev => that.onDrop(ev, null, 'layout', id)
        }
        : {}

      return isLayoutWrapper ? (
        <div key={id} {...layoutDragProps} className={'comp-item-layout'}>
          {!Object.keys(props.schema.properties).length ? (
            <p className='comp-item-layout-empty'>
              请从左边字段<strong>拖拽</strong>组件进来这里
            </p>
          ) : (
            React.createElement(Field, { ...props, layoutId: id })
          )}
          <div className='comp-item-layout-tool'>
            <a
              onClick={ev => {
                ev.preventDefault()
                that.onMouseClick(id, comp, 'layout')
              }}
              href='javascript:;'
              className='preview-line-layer-layout'
              title='编辑'
            >
              <UI.Icon type='edit' size='small' />
            </a>
            <a
              className='preview-line-del'
              type='delete'
              size='small'
              href='javascript:;'
              onClick={() => {
                that.props.changeComponent()
                that.deleteComponent(id)
              }}
              title='删除'
            >
              <UI.Icon type='ashbin' size='small' />
            </a>
          </div>
        </div>
      ) : (
        <div key={id} className={'comp-item'}>
          <div
            className='preview-line-bar'
            onDragOver={that.onDragOver}
            onDragLeave={that.onDragLeave}
            onDrop={ev =>
              that.onDrop(
                ev,
                id,
                props.schemaPath.length > 1 ? 'layout' : '',
                props.schemaPath.length > 1 ? props.schemaPath[0] : ''
              )
            }
          />
          <div
            className={cls(
              'next-form-item next-row',
              'preview-line',
              active ? 'preview-line-active' : ''
            )}
            name={title}
            draggable
            onDragStart={ev => that.onDragStart(ev, id, 'move')}
          >
            {React.createElement(Field, { ...props })}
            <div
              className='preview-line-layer'
              onClick={ev => {
                ev.preventDefault()
                that.onMouseClick(id, comp)
              }}
            />
            <a
              className='preview-line-del'
              type='delete'
              size='small'
              onClick={() => {
                that.props.changeComponent()
                that.deleteComponent(id)
              }}
            >
              删除
            </a>
          </div>
        </div>
      )
    })
  )
}
