import request from './request'
//获取分类列表
export function getKindList(){
	return request({
		method:'get',
		url:'bufanapi/api/admin/kind/list'
	})
}
//添加分类
export function addKind(data){
	return request({
		method:'post',
		url:'bufanapi/api/admin/kind/save',
		data
	})
}
//删除分类
export function delKind(id,type){
	return request({
		method:'post',
		url:'bufanapi/api/admin/kind/del',
		data:{
			id,
			type
		}
	})
}