import { ESTree } from 'meriyah';
import { JSXElement, JSXFragment, JSXLiteralFunc, JSXNode, JSXNodeFunc, JSXText } from '../types';
import { isUnknownHTMLElementTagName } from './isUnknownElementTagName';
import { RenderingOptions } from './options';
import { For, Index, Match, Show, Switch, children, createEffect, createMemo, createSignal, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from "solid-js/web";
import { AnyFunction, EvaluateOptions, JSXContext } from 'evaluate';

const fileName = 'jsx';

// export const RenderJSX = (props: { node: JSXNodeFunc | JSXNodeFunc[], options: RenderingOptions & EvaluateOptions, ctx: JSXContext }) => {
//   // for (let k in props.options.binding) {
//   //   props.ctx.setVariable(k, props.options.binding[k])
//   // }
//   let ctx_cpy = createMemo(() => {
//     console.log("#######################memo update")
//     let ctx = props.ctx
//     for (let k in props.options.binding) {
//       ctx.setVariable(k, props.options.binding[k])
//     }
//     return ctx
//   })

//   if (props.node === undefined) return undefined;
//   if (props.node === null) return undefined;
//   if (Array.isArray(props.node)) {
//     return <For each={props.node}>{(node, _i) =>
//       <RenderJSX node={node} options={props.options} ctx={props.ctx} />
//     }</For>
//   }

//   // console.log("##")
//   // console.log(props.node)
//   // console.log(props.node.func(props.options.binding))
//   // console.log("##")

//   // return (
//   //   <Switch>
//   //     <Match when={Array.isArray(props.node)}>
//   //       return <For each={props.node}>{(node, _i) =>
//   //         <RenderJSX node={node()} options={props.options} />
//   //       }</For>
//   //     </Match>
//   //     <Match when={typeof props.node() === 'boolean'}>
//   //       <>{props.node(props.options.binding)}</>
//   //     </Match>
//   //     <Match when={typeof props.node() === 'string'} >
//   //       return <RenderJSXText text={props.node()} options={props.options} />
//   //     </Match>
//   //   </Switch>
//   // )
//   // console.log(props.node)
//   // console.log(props.node.func(props.options.binding))
//   const tmp_func = (ctx: JSXContext): JSXNode => {
//     console.log("$$$$$$$$$$$$$$$$$$$$$")
//     return props.node.func(ctx)
//   }

//   if (props.node.type === 'Node') {
//     return <>
//       {/* <RenderJSXNode node={props.node.func(ctx_cpy()) as (JSXElement | JSXFragment)} options={props.options} ctx={ctx_cpy()} /> */}
//       <RenderJSXNode node={tmp_func(ctx_cpy()) as (JSXElement | JSXFragment)} options={props.options} ctx={ctx_cpy()} />
//     </>
//   }
//   // return <RenderJSXText text={(props.node as JSXLiteralFunc).func(ctx_cpy())} options={props.options} ctx={ctx_cpy()} />
//   return <RenderJSXText text={tmp_func(ctx_cpy())} options={props.options} ctx={ctx_cpy()} />
// };

export const RenderJSX = (props: { node: JSXNodeFunc | JSXNodeFunc[], options: RenderingOptions & EvaluateOptions, ctx: JSXContext }) => {
  // for (let k in props.options.binding) {
  //   props.ctx.setVariable(k, props.options.binding[k])
  // }

  const late_func = () => {
    // console.log("#######################memo update")
    let ctx = props.ctx
    for (let k in props.options.binding) {
      ctx.setVariable(k, props.options.binding[k])
    }
    ctx.bindingset(props.options.binding ?? {})
    return ctx
  }
  // let ctx_cpy = createMemo(late_func, late_func(), { equals: false })
  let [ctx_cpy, set_ctx_cty] = createSignal(late_func(), { equals: false })

  createEffect(() => {
    // console.log("#######################memo update")
    let ctx = props.ctx
    for (let k in props.options.binding) {
      ctx.setVariable(k, props.options.binding[k])
    }
    console.log(props.options.binding.time)
    ctx.bindingset(props.options.binding ?? {})
    set_ctx_cty(ctx)
  })

  // if (props.node === undefined) return undefined;
  // if (props.node === null) return undefined;
  // if (Array.isArray(props.node)) {
  //   return <For each={props.node}>{(node, _i) =>
  //     <RenderJSX node={node} options={props.options} ctx={props.ctx} />
  //   }</For>
  // }

  const tmp_func = (ctx: JSXContext): JSXNode => {
    // console.log("$$$$$$$$$$$$$$$$$$$$$")
    return props.node.func(ctx)
  }

  return (
    <>
      {/* <div>{`${ctx_cpy().binding.time}`}</div> */}
      {/* <div>{`${props.options.binding.time}`}</div> */}
      <Switch>
        <Match when={Array.isArray(props.node)}>
          <For each={props.node as JSXNodeFunc[]}>{(node, _i) =>
            <RenderJSX node={node} options={props.options} ctx={props.ctx} />
          }</For>
        </Match>
        <Match when={!Array.isArray(props.node) && props.node.type === 'Node'}>
          <RenderJSXNode node={tmp_func(ctx_cpy()) as (JSXElement | JSXFragment)} options={props.options} ctx={ctx_cpy()} />
        </Match>
        <Match when={!Array.isArray(props.node) && props.node.type === 'Literal'} >
          <RenderJSXText text={tmp_func(ctx_cpy())} options={props.options} ctx={ctx_cpy()} />
        </Match>
      </Switch>
    </>
  )
  // console.log(props.node)
  // console.log(props.node.func(props.options.binding))

  // if (props.node.type === 'Node') {
  //   return <>
  //     {/* <RenderJSXNode node={props.node.func(ctx_cpy()) as (JSXElement | JSXFragment)} options={props.options} ctx={ctx_cpy()} /> */}
  //     <RenderJSXNode node={tmp_func(ctx_cpy()) as (JSXElement | JSXFragment)} options={props.options} ctx={ctx_cpy()} />
  //   </>
  // }
  // // return <RenderJSXText text={(props.node as JSXLiteralFunc).func(ctx_cpy())} options={props.options} ctx={ctx_cpy()} />
  // return <RenderJSXText text={tmp_func(ctx_cpy())} options={props.options} ctx={ctx_cpy()} />
};

const RenderJSXText = (props: { text: JSXText | boolean | undefined | null, options: RenderingOptions, ctx: JSXContext }) => {
  return (
    <Switch>
      <Match when={props.text === null || typeof props.text === 'undefined'}>
      </Match>
      <Match when={typeof props.text === 'boolean'}>
        {props.text}
      </Match>
      <Match when={typeof props.text === 'string' || typeof props.text === 'number'}>
        {applyFilter(props.options.textFilters || [], props.text as (string | number))}
      </Match>
    </Switch>
  )
  // if (props.text === null)
  //   return undefined
  // switch (typeof props.text) {
  //   case 'boolean': return <>{props.text}</>
  //   case 'undefined': return undefined
  //   default: return applyFilter(props.options.textFilters || [], props.text);
  // }
};

const RenderJSXNode = (props: { node: JSXElement | JSXFragment, options: RenderingOptions, ctx: JSXContext }) => {
  if (!props.node) return undefined
  switch (props.node.type) {
    case 'element':
      return <RenderJSXElement element={props.node} options={props.options} ctx={props.ctx} />;
    case 'fragment':
      return <RenderJSXFragment fragment={props.node} options={props.options} ctx={props.ctx} />
  }
};

const RenderJSXElement = (props: { element: JSXElement, options: RenderingOptions & EvaluateOptions, ctx: JSXContext }) => {
  const filtered = applyFilter(props.options.elementFilters ?? [], props.element);

  if (!filtered) return undefined;

  if (props.options.disableUnknownHTMLElement && typeof filtered.component === 'string') {
    const checker = props.options.isUnknownHTMLElementTagName || isUnknownHTMLElementTagName;
    if (checker(filtered.component)) return undefined;
  }

  // const component = filtered.component as AnyFunction;
  // if (typeof component === 'function') {
  //   const props = { ...filtered.props };
  //   let children = component(props);
  //   if (!Array.isArray(children)) children = [children];
  //   console.log(children)
  //   return (
  //     <>
  //       {
  //         children.map((child: JSXNode | JSXNode[]) => renderJSX(child, options))
  //       }
  //     </>
  //   )
  // }

  let move_props = mergeProps(filtered.props, renderSourcePosition(props.element.loc, props.options))

  // SolidJS実装
  if (!(props.options as EvaluateOptions).disableSolidJSComponents) {
    if (typeof filtered.component === 'string') {
      // SolidJSのFor実装
      if (filtered.component === 'For') {
        let [each, other_props] = splitProps(move_props, ['each'])
        return (
          <For each={each.each} {...other_props}>{(for_child, for_i) => {
            // return <For each={filtered.children} {...other_props}>{(child, _i) => {
            //   // 何回も呼ばれる。パフォーマンス注意
            //   // console.log("#")
            //   if (typeof child === 'function') {
            //     // return <></>
            //     return <RenderJSX node={(child as AnyFunction)(for_child, for_i)} options={props.options} />
            //   } else {
            //     throw new Error('why this is not function')
            //   }

            // if (typeof filtered.children[0] === 'function') {
            //   // return <></>
            //   return <RenderJSX node={(filtered.children[0] as AnyFunction)(for_child, for_i)} options={props.options} />
            // } else {
            //   console.log(filtered.children[0])
            //   return <></>
            //   // throw new Error('why this is not function')
            // }
            // return <RenderJSX node={(filtered.children[0].func(props.options.binding) as AnyFunction)(for_child, for_i)} options={props.options} />
            // let anyfunc: AnyFunction = filtered.children[0].func(props.ctx) as unknown as AnyFunction
            // console.log(anyfunc)
            // let compo = anyfunc(for_child, for_i)
            // console.log(compo)

            let nnn = new JSXNodeFunc((ctx: JSXContext) => {
              let anyfunc: AnyFunction = filtered.children[0].func(ctx) as unknown as AnyFunction
              // console.log(for_child)
              let compo = anyfunc(for_child, for_i)
              // console.log(compo)
              // console.log(ctx.stack.variables)
              // console.log(props.ctx.stack.variables)
              return compo
            }, 'Node')
            // return <RenderJSX node={(filtered.children[0].func as AnyFunction)(for_child, for_i, props.options.binding)} options={props.options} />
            // props.ctx.stack.set()
            return <RenderJSX node={nnn} options={props.options} ctx={props.ctx} />
          }}</For>
        )
      }
      if (filtered.component === 'Index') {
        let [each, other_props] = splitProps(move_props, ['each'])
        return (
          <Index each={each.each} {...other_props}>{(index_child, index_i) => {
            if (typeof filtered.children[0] === 'function') {
              return <RenderJSX node={(filtered.children[0] as AnyFunction)(index_child, index_i)} options={props.options} ctx={props.ctx} />
            } else {
              return <></>
              // throw new Error('why this is not function')
            }
          }}</Index>
        )
      }
      if (filtered.component === 'Show') {
        // let [when, other_props] = splitProps(move_props, ['when'])
        let [when, other_props] = splitProps(props.element.props, ['when'])
        // console.log("&&&&&&&&&&&&&&&&&&:")
        // console.log(when.when)
        // console.log(props.element.props.when)

        createEffect(() => {
          console.dir(props.element.props)
          // console.log(props.options.binding.onetime())
        })

        // console.log(props.options.binding.onetime())
        return (
          <>
            {/* <div>{`${props.options.binding.time}ffffffffffff`}</div> */}
            {/* <div>{`${when.when}ffffffffffff`}</div> */}
            <Show when={props.element.props.when} {...other_props}>
              {/* <div>{`${props.element.props.when}ffffffffffff`}</div> */}
              <For each={filtered.children}>{(child, _i) =>
                <RenderJSX node={child} options={props.options} ctx={props.ctx} />
              }</For>
            </Show>
          </>
        )
      }
    }
  }

  console.log(`####: ${filtered.component}`)
  console.log(filtered.component)

  return (
    <Dynamic component={filtered.component} {...move_props}>
      <For each={filtered.children}>{(child, _i) =>
        <RenderJSX node={child} options={props.options} ctx={props.ctx} />
      }</For>
    </Dynamic>
  );
  // return (
  //   <Dynamic component={filtered.component} {...move_props}>
  //     <For each={filtered.children}>{(child, _i) => {
  //       // console.log("###############")
  //       // console.log(child)
  //       // console.log("###############")
  //       return <RenderJSX node={child} options={props.options} />
  //     }}</For>
  //   </Dynamic>
  // );
};

const RenderJSXFragment = (props: { fragment: JSXFragment, options: RenderingOptions, ctx: JSXContext }) => {
  const filtered = applyFilter(props.options.fragmentFilters || [], props.fragment);

  if (filtered) {
    return (
      <For each={filtered.children}>{(child, _i) =>
        <RenderJSX node={child} options={props.options} ctx={props.ctx} />
      }</For>
    )
  } else {
    return <></>;
  }
};

const applyFilter = <T extends JSXNode>(filters: ((target: T) => T | undefined)[], node: T): T | undefined => {
  return filters.reduce<T | undefined>((prev, filter) => (prev ? filter(prev) : undefined), node);
};

type SourcePosition = {
  __source: {
    fileName: string;
    lineNumber?: number;
    columnNumber?: number;
  };
};

const renderSourcePosition = (loc: ESTree.Position | undefined, _options: RenderingOptions): SourcePosition | Record<string, never> => {
  return loc ? { __source: { fileName, lineNumber: loc.line, columnNumber: loc.column } } : { __source: { fileName } };
};
