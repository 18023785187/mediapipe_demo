/**
 * 把THREE.Object3D和mediapipe人脸检测结果进行结合，使得3d模型做出相应动作
 */
export default function faceConnect(object3D, results) {
  const { multiFaceLandmarks: [multiFaceLandmark] } = results;
  if (!multiFaceLandmark) return;
  const head = object3D.getObjectByName('mesh_2');
  const { morphTargetDictionary: dictionary, morphTargetInfluences: influences } = head;

  connectEye();
  connectJaw();

  // 处理眼睛
  function connectEye() {
    const extraVertex = multiFaceLandmark[10]; // 额头顶点
    const jawPoint = multiFaceLandmark[152]; // 下巴尖
    const leftTopEye = multiFaceLandmark[159]; // 左眼上眼帘顶点
    const leftBottomEye = multiFaceLandmark[145]; // 左眼下眼帘顶点
    const rightTopEye = multiFaceLandmark[386]; // 右眼上眼帘顶点
    const rightBottomEye = multiFaceLandmark[374]; // 右眼下眼帘顶点

    // 定义眼张开长度范围为脸长的 0-5%
    const newEyeBlink_L = Math.round((leftBottomEye.y - leftTopEye.y) / (jawPoint.y - extraVertex.y) * 100 * 2) / 10;
    influences[dictionary['eyeBlink_L']] = 1 - (newEyeBlink_L > 1 ? 1 : (newEyeBlink_L <= .5 ? 0 : newEyeBlink_L));
    const newEyeBlink_R = Math.round((rightBottomEye.y - rightTopEye.y) / (jawPoint.y - extraVertex.y) * 100 * 2) / 10;
    influences[dictionary['eyeBlink_R']] = 1 - (newEyeBlink_R > 1 ? 1 : (newEyeBlink_R <= .5 ? 0 : newEyeBlink_R));
  }

  // 处理下巴
  function connectJaw() {
    const extraVertex = multiFaceLandmark[10]; // 额头顶点
    const jawPoint = multiFaceLandmark[152]; // 下巴尖
    const topInnerLip = multiFaceLandmark[13]; // 上内唇
    const bottomInnerLip = multiFaceLandmark[14]; // 下内唇
    // 定义嘴张开长度范围为脸长的 0-20%
    const newJawOpen = Math.round((bottomInnerLip.y - topInnerLip.y) / (jawPoint.y - extraVertex.y) * 100 / 2) / 10;
    influences[dictionary['jawOpen']] = newJawOpen > 1 ? 1 : newJawOpen;
  }
}