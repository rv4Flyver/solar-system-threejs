define(
[
  'Models/CelestialObject',
  'Environment/Constants'
],
function(CelestialObject, Constants) {
  'use strict';

  const DISTANCE_TO_KUIPER_BELT = 7479893535; // Kuiper Belt radius

  class Sun extends CelestialObject {
    constructor(data) {
      super(data.diameter, data.mass, data.gravity, data.density);

      this._id = data.id || null;
      this._name = data.name || null;
      this._rotationPeriod = data.rotationPeriod || null;
      this._lengthOfDay = data.lengthOfDay || null;
      this._distanceFromParent = data.distanceFromParent || null;
      this._axialTilt = data.axialTilt || null;
      this._meanTemperature = data.meanTemperature || null;
      this._threeDiameter = this.createThreeDiameter();
      this._threeRadius = this.createThreeRadius();
      this._surface = this.createSurface(data._3d.textures.base, data._3d.textures.topo);
      this._threeObject = this.createGeometry(this._surface);
    };


    /**
     * 3D Model Data
     */
    get threeDiameter() {
      return this._threeDiameter;
    };

    get threeRadius() {
      return this._threeRadius;
    };

    get threeObject() {
      return this._threeObject;
    };

    getTexture(src) {
      if (src) {
        var texture = THREE.ImageUtils.loadTexture(src);

        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        return texture;
      }
    };

    createThreeDiameter() {
      return this._diameter * Constants.universeScale;
    };

    createThreeRadius() {
      return (this._diameter * Constants.universeScale) / 2;
    };

    createGeometry(surface) {
      var geometry = new THREE.SphereGeometry(
          this._threeRadius,
          90,
          90
      );

      var mesh = new THREE.Mesh(geometry, surface);
      var lightColor = 0xffffff;
      var intesity = 1;
      var lightDistanceStrength = DISTANCE_TO_KUIPER_BELT * Constants.universeScale;
      var lightDecayRate = 0.8;
      var sunLight = new THREE.PointLight(lightColor, intesity, lightDistanceStrength, lightDecayRate);

      mesh.rotation.x = 90 * Constants.degreesToRadiansRatio; // degrees to radians

      mesh.add(sunLight);

      return mesh;
    };

    createSurface(base, topo) {
      if (!base) {
        return;
      }

      var texture = this.getTexture(base);

      texture.minFilter = THREE.NearestFilter;

      return new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
        opacity: 0.5 // 0.8
      });

      return new THREE.MeshPhongMaterial({ map: texture });
    };
  }

  return Sun;
});